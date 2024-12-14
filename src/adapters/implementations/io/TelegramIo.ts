import TelegramBot from 'node-telegram-bot-api';
import { IConfig } from '../../interfaces/IConfig.js';
import { IIo } from '../../interfaces/IIo.js';
import { LoggerFactory } from '../logger/LoggerFactory.js';
import { ILogger } from '../../interfaces/ILogger.js';

export class TelegramIo implements IIo {
  private readonly bot: TelegramBot;
  private readonly logger: ILogger = LoggerFactory(TelegramIo.name);

  constructor(private readonly config: IConfig) {
    this.bot = new TelegramBot(this.config.getOrThrow('TELEGRAM_BOT_TOKEN'), {
      polling: true,
    });

    this.bot.onText(/.*/, (msg, match) =>
      this.read(
        match ? match[0] : '',
        String(msg.from?.id),
        String(msg.chat.id),
      ),
    );

    this.logger.log('✓ Started');
  }

  async read(message: string, authorId: string, roomId: string): Promise<void> {
    this.write(`${authorId} said ${message}`, roomId);
  }

  async write(message: string, roomId: string): Promise<void> {
    try {
      await this.bot.sendMessage(roomId, message);
    } catch (e: unknown) {
      this.logger.error(JSON.stringify(e));
    }
  }
}
