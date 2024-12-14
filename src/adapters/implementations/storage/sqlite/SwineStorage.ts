import { FIELDS_METADATA_KEY, IFieldData } from '../../../../decorators/Field.js';
import { SwineEntity } from '../../../../entities/SwineEntity.js';
import { SqliteStorage } from './SqliteStorage.js';

export class SwineStorage extends SqliteStorage<SwineEntity> {
  protected get tableName(): string {
    return SwineStorage.name;
  }

  protected get fields(): IFieldData[] {
    return (
      Reflect.getMetadata(FIELDS_METADATA_KEY, new SwineEntity()) || []
    );
  }
}
