import { ILogger } from '../../interfaces/ILogger.js';
import { ConsoleLogger } from './ConsoleLogger.js';

export function LoggerFactory(context: string): ILogger {
  return new ConsoleLogger(context);
}
