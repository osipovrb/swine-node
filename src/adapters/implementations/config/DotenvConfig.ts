import { config } from 'dotenv';
import { IConfig } from '../../interfaces/IConfig.js';
import { ILogger } from '../../interfaces/ILogger.js';
import { LoggerFactory } from '../logger/LoggerFactory.js';

config();

export class DotenvConfig implements IConfig {
  private readonly logger: ILogger = LoggerFactory(DotenvConfig.name);

  constructor() {
    this.logger.log('✓ Started');
  }

  get(key: string): string | undefined {
    return process.env[key];
  }

  getOrThrow(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`Environment variable "${key}" is not defined`);
    }

    return value;
  }
}
