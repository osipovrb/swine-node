import {
  FIELDS_METADATA_KEY,
  IFieldData,
} from '../../../../decorators/Field.js';
import { SwineEntity } from '../../../../entities/SwineEntity.js';
import { IConfig } from '../../../interfaces/IConfig.js';
import { ILogger } from '../../../interfaces/ILogger.js';
import { LoggerFactory } from '../../logger/LoggerFactory.js';
import { SqliteStorage } from './SqliteStorage.js';

export class SwineStorage extends SqliteStorage<SwineEntity> {
  protected readonly logger: ILogger = LoggerFactory(SwineStorage.name);

  constructor(config: IConfig) {
    super(config);
    this.logger.log('✓ Started');
  }

  protected get tableName(): string {
    return SwineStorage.name;
  }

  protected get fields(): IFieldData[] {
    return Reflect.getMetadata(FIELDS_METADATA_KEY, new SwineEntity()) || [];
  }
}
