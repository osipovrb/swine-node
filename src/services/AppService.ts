import { LoggerFactory } from '../adapters/implementations/logger/LoggerFactory.js';
import { SwineStorage } from '../adapters/implementations/storage/sqlite/SwineStorage.js';
import { IConfig } from '../adapters/interfaces/IConfig.js';
import { ILogger } from '../adapters/interfaces/ILogger.js';
import { SwineEntity } from '../entities/SwineEntity.js';

export class AppService {
  private readonly logger: ILogger = LoggerFactory(AppService.name);

  constructor(
    private readonly config: IConfig,
    private readonly swineStorage: SwineStorage,
  ) {}

  async run(): Promise<void> {
    //
  }
}
