import { DotenvConfig } from './adapters/implementations/config/DotenvConfig.js';
import { TelegramIo } from './adapters/implementations/io/TelegramIo.js';
import { LoggerFactory } from './adapters/implementations/logger/LoggerFactory.js';
import { MealStorage } from './adapters/implementations/storage/sqlite/MealStorage.js';
import { SwineStorage } from './adapters/implementations/storage/sqlite/SwineStorage.js';
import { Dict } from './adapters/implementations/swine-father/Dict.js';
import { SwineFather } from './adapters/implementations/swine-father/SwineFather.js';

async function main() {
  const logger = LoggerFactory('SwineFather');

  logger.log('🚀 Starting...');

  const config = new DotenvConfig();
  const swineStorage = new SwineStorage(config);
  const mealStorage = new MealStorage(config);
  const dict = new Dict();
  const swineFather = new SwineFather(config, swineStorage, mealStorage, dict);

  new TelegramIo(config, swineFather);
}

main().catch((err) => {
  console.error(err);
});
