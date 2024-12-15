import {
  FIELDS_METADATA_KEY,
  IFieldData,
} from '../../../../decorators/Field.js';
import { MealEntity } from '../../../../entities/MealEntity.js';
import { IConfig } from '../../../interfaces/IConfig.js';
import { ILogger } from '../../../interfaces/ILogger.js';
import { LoggerFactory } from '../../logger/LoggerFactory.js';
import { SqliteStorage } from './SqliteStorage.js';

export class MealStorage extends SqliteStorage<MealEntity> {
  protected readonly logger: ILogger = LoggerFactory(MealStorage.name);

  constructor(config: IConfig) {
    super(config);
    this.logger.log('✓ Started');
  }

  protected get tableName(): string {
    return MealStorage.name;
  }

  protected get fields(): IFieldData[] {
    return Reflect.getMetadata(FIELDS_METADATA_KEY, new MealEntity()) || [];
  }
}
