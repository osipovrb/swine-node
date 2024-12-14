import { DotenvConfig } from './adapters/implementations/config/DotenvConfig.js';
import { TelegramIo } from './adapters/implementations/io/TelegramIo.js';
import { LoggerFactory } from './adapters/implementations/logger/LoggerFactory.js';
import { SwineStorage } from './adapters/implementations/storage/sqlite/SwineStorage.js';
import { SwineFather } from './adapters/implementations/swine-father/SwineFather.js';

async function main() {
  const logger = LoggerFactory('SwineFather');

  logger.log('🚀 Starting...');

  const config = new DotenvConfig();
  const swineStorage = new SwineStorage(config);
  const swineFather = new SwineFather(config, swineStorage);

  new TelegramIo(config, swineFather);
}

main().catch((err) => {
  console.error(err);
});
