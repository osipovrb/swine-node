import Database from 'better-sqlite3';
import 'reflect-metadata';

import { BaseEntity } from '../../../../entities/BaseEntity.js';
import { IFieldData } from '../../../../decorators/Field.js';
import { IStorage } from '../../../interfaces/IStorage.js';
import { IConfig } from '../../../interfaces/IConfig.js';
import { ILogger } from '../../../interfaces/ILogger.js';
import { LoggerFactory } from '../../logger/LoggerFactory.js';

export abstract class SqliteStorage<T extends BaseEntity<T>>
  implements IStorage<T>
{
  protected db: InstanceType<typeof Database>;
  private readonly logger: ILogger = LoggerFactory(SqliteStorage.name);

  constructor(protected config: IConfig) {
    const dbFilePath = config.getOrThrow('SQLITE_DATABASE_PATH');
    this.db = new Database(dbFilePath);

    this.createTableIfNotExists();
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

  async create<Entity>(entity: Partial<T>): Promise<Entity> {
    const fieldNames = this.fieldNames.filter(
      (field) => ['id', 'createdAt', 'updatedAt'].includes(field) === false,
    );

    const payload = fieldNames.map((field) => (entity as any)[field] ?? null);

    const now = new Date().toISOString();
    fieldNames.push('createdAt', 'updatedAt');
    payload.push(now, now);

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
    const row = stmt.get(id);

    if (!row) {
      this.logger.warn(`Find failed: ${query}. Payload: ${id}`);
    }

    return row ? (row as T) : null;
  }

  async search(criteria: Partial<T>): Promise<T[]> {
    const where = Object.keys(criteria).map((key) => `${key} = ?`);
    const query = `SELECT * FROM ${this.tableName} WHERE ${where}`;
    const stmt = this.db.prepare(query);
    const result = stmt.all(Object.values(criteria)) as T[];

    return result;
  }

  async update(id: number, entity: T): Promise<T | null> {
    const fieldNames = this.fields
      .filter(({ name }) => !['createdAt', 'updatedAt'].includes(name))
      .map(({ name }) => name);

    fieldNames.push('updatedAt');

    const setClause = fieldNames
      .map((fieldName) => `${fieldName} = ?`)
      .join(', ');

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

    const now = new Date().toISOString();
    const payload = this.fields.map((field) => (entity as any)[field.name]);
    payload.push(now, id);

    const stmt = this.db.prepare(query);
    const result = stmt.run(...payload);

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
}