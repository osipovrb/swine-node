import { config } from 'dotenv';
import { IConfig } from '../../interfaces/IConfig.js';

config();

export class DotenvConfig implements IConfig {
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
