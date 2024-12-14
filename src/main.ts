import { DotenvConfig } from './adapters/implementations/config/DotenvConfig.js';
import { SwineStorage } from './adapters/implementations/storage/sqlite/SwineStorage.js';
import { AppService } from './services/AppService.js';

async function main() {
  const config = new DotenvConfig();
  const swineStorage = new SwineStorage(config);

  const appService = new AppService(config, swineStorage);

  await appService.run();
}

main().catch((err) => {
  console.error(err);
});
