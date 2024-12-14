import { DotenvConfig } from './adapters/implementations/config/DotenvConfig.js';
import { TelegramIo } from './adapters/implementations/io/TelegramIo.js';
import { LoggerFactory } from './adapters/implementations/logger/LoggerFactory.js';
import { SwineStorage } from './adapters/implementations/storage/sqlite/SwineStorage.js';
import { AppService } from './services/AppService.js';

async function main() {
  const logger = LoggerFactory('SwineFather');

  logger.log('🚀 Starting...');

  const config = new DotenvConfig();
  const swineStorage = new SwineStorage(config);
  const io = new TelegramIo(config);

  const appService = new AppService(config, swineStorage);

  await appService.run();
}

main().catch((err) => {
  console.error(err);
});
