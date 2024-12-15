import Database from 'better-sqlite3';
import 'reflect-metadata';

import { BaseEntity } from '../../../../entities/BaseEntity.js';
import { FieldTypeEnum, IFieldData } from '../../../../decorators/Field.js';
import {
  IStorage,
  IStorageSearchCriteria,
  IStorageSort,
  TStorageSearchGlue,
} from '../../../interfaces/IStorage.js';
import { IConfig } from '../../../interfaces/IConfig.js';
import { ILogger } from '../../../interfaces/ILogger.js';

export abstract class SqliteStorage<T extends BaseEntity<T>>
  implements IStorage<T>
{
  protected db: InstanceType<typeof Database>;
  protected abstract readonly logger: ILogger;

  constructor(protected config: IConfig) {
    const dbFilePath = config.getOrThrow('SQLITE_DATABASE_PATH');
    this.db = new Database(dbFilePath);

    this.createTableIfNotExists();
    this.syncTableStructure();
  }

  protected abstract get tableName(): string;
  protected abstract get fields(): IFieldData[];

  protected get fieldNames(): string[] {
    return this.fields.map((field) => field.name);
  }

  private createTableIfNotExists(): void {
    const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name = ?;`;
    const tableExists = this.db.prepare(tableExistsQuery).get(this.tableName);

    if (!tableExists) {
      const columns = this.fields
        .filter((field) => field.name !== 'id')
        .map((field) => `${field.name} ${field.type}`)
        .join(', ');

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ${columns}
        );
      `;

      try {
        this.db.prepare(createTableQuery).run();
        this.logger.log(
          `Created table "${this.tableName}" with columns: ${columns}`,
        );
      } catch (err) {
        this.logger.error(err);

        throw new Error(`Failed to create table "${this.tableName}"`);
      }
    }
  }

  private syncTableStructure() {
    const table = this.tableName;
    const currentStructure = this.db
      .prepare(`PRAGMA table_info(${this.tableName})`)
      .all();

    const currentColumns: Record<string, string> = {};
    currentStructure.forEach((column: any) => {
      currentColumns[column.name] = column.type;
    });

    this.fields.forEach((field) => {
      const col = field.name;
      const type = field.type;

      if (currentColumns[col]) {
        // column exists, check its type
        if (currentColumns[col] !== type) {
          // type differs, recreating column
          this.db.prepare(`ALTER TABLE ${table} DROP COLUMN ${col}`).run();
          this.db
            .prepare(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`)
            .run();
        }
      } else {
        // column does not exists - create new one
        this.db.prepare(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`).run();
      }
    });

    // columns that exists in table structure, but not exists in this.fields
    const columnsToDelete = Object.keys(currentColumns).filter(
      (columnName) => !this.fields.some((field) => field.name === columnName),
    );

    // removing leftovers
    columnsToDelete.forEach((col) => {
      this.db.prepare(`ALTER TABLE ${table} DROP COLUMN ${col}`).run();
    });
  }

  async create<Entity>(entity: Partial<T>): Promise<Entity> {
    const fieldNames = this.fieldNames.filter(
      (field) => ['id', 'createdAt', 'updatedAt'].includes(field) === false,
    );

    const payload = fieldNames.map((field) => (entity as any)[field] ?? null);

    const now = new Date();
    fieldNames.push('createdAt', 'updatedAt');
    payload.push(now.toISOString(), now.toISOString());

    const columns = fieldNames.join(', ');
    const placeholders = fieldNames.map((_) => '?').join(', ');

    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;

    const stmt = this.db.prepare(query);
    const result = stmt.run(...payload);

    if (result.changes <= 0) {
      this.logger.error(`Create failed: ${query}. Payload: ${payload}`);

      throw new Error(`Create failed`);
    }

    return {
      ...entity,
      createdAt: now,
      updatedAt: now,
      id: result.lastInsertRowid,
    } as Entity;
  }

  async find(id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const stmt = this.db.prepare(query);
    const row = stmt.get(id) as T | null;

    if (!row) {
      this.logger.warn(`Find failed: ${query}. Payload: ${id}`);
    } else {
      if (row.createdAt) {
        row.createdAt = new Date(row.createdAt);
      }

      if (row.updatedAt) {
        row.updatedAt = new Date(row.updatedAt);
      }
    }

    return row ? (row as T) : null;
  }

  async search(
    criteria: IStorageSearchCriteria<T>[],
    sort?: IStorageSort<T>[],
    glue?: TStorageSearchGlue,
  ): Promise<T[]> {
    const whereClauses = criteria.map(
      ({ field, operator }) => `${String(field)} ${operator ?? '='} ?`,
    );
    const where = whereClauses.join(` ${glue ?? 'AND'} `);
    let query = `SELECT * FROM ${this.tableName} WHERE ${where}`;

    if (sort) {
      const sortClauses = sort.map(
        ({ field, direction }) => `${String(field)} ${direction ?? 'ASC'}`,
      );
      query += ` ORDER BY ${sortClauses.join(', ')}`;
    }

    const stmt = this.db.prepare(query);
    const payload = this.castPayload(criteria.map(({ value }) => value));
    const result = this.castRows(stmt.all(payload) as T[]);

    return result;
  }

  async update(id: number, entity: T): Promise<T | null> {
    const fieldNames = Object.keys(entity);

    const placeholders = fieldNames.map((fieldName) => `${fieldName} = ?`);
    const payload = Object.values(entity);

    if (!fieldNames.includes('updatedAt')) {
      placeholders.push('updatedAt = ?');
      payload.push(new Date());
    }

    const setClause = placeholders.join(', ');

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

    payload.push(id);

    const stmt = this.db.prepare(query);
    const result = stmt.run(...this.castPayload(payload));

    if (result.changes <= 0) {
      this.logger.warn(`Update failed: ${query}. Payload: ${id}`);
    }

    return result.changes > 0 ? entity : null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const stmt = this.db.prepare(query);
    const result = stmt.run(id);

    if (result.changes <= 0) {
      this.logger.warn(`Delete failed: ${query}. Payload: ${id}`);
    }

    return result.changes > 0;
  }

  private castPayload(payload: unknown[]) {
    return payload.map((el) => (el instanceof Date ? el.toISOString() : el));
  }

  private castRow(row: T): T {
    const castedRow = { ...row } as Record<string, any>;

    Object.keys(row as Record<string, any>).forEach((key) => {
      const field = this.fields.find(({ name }) => name === key);
      if (field?.type === FieldTypeEnum.DATE) {
        castedRow[key] = new Date((row as Record<string, any>)[key] as string);
      }
    });

    return castedRow as T;
  }

  private castRows(rows: T[]): T[] {
    return rows.map((row) => this.castRow(row));
  }
}
