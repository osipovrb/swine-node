import TelegramBot from 'node-telegram-bot-api';
import { IConfig } from '../../interfaces/IConfig.js';
import { IIo } from '../../interfaces/IIo.js';
import { LoggerFactory } from '../logger/LoggerFactory.js';
import { ILogger } from '../../interfaces/ILogger.js';
import { ISwineFather } from '../../interfaces/ISwineFather.js';

export class TelegramIo implements IIo {
  private readonly bot: TelegramBot;
  private readonly logger: ILogger = LoggerFactory(TelegramIo.name);

  constructor(
    private readonly config: IConfig,
    private readonly swineFather: ISwineFather,
  ) {
    this.bot = new TelegramBot(this.config.getOrThrow('TELEGRAM_BOT_TOKEN'), {
      polling: true,
    });

    this.bot.onText(/\/echo (.+)/, async (msg, match) => {
      this.write(String(msg.chat.id), match ? match[1] : '');
    });

    this.bot.onText(/\/name (.+)/, async (msg, match) => {
      await this.nameCommand(
        String(msg.chat.id),
        String(msg.from?.id),
        match ? match[1] : '',
      );
    });

    this.bot.onText(/\/my/, async (msg) => {
      await this.myCommand(String(msg.chat.id), String(msg.from?.id));
    });

    this.bot.onText(/\/grow/, async (msg) => {
      await this.growCommand(String(msg.chat.id), String(msg.from?.id));
    });

    
    this.bot.onText(/\/top/, async (msg) => {
      await this.topCommand(String(msg.chat.id));
    });

    this.logger.log('✓ Started');
  }

  async nameCommand(
    roomId: string,
    userId: string,
    swineName: string,
  ): Promise<void> {
    try {
      const reply = await this.swineFather.name(roomId, userId, swineName);
      await this.publicReply(roomId, userId, reply);
    } catch (e: unknown) {
      this.logger.error(JSON.stringify(e));
      await this.write(roomId, 'Что-то пошло не так...');
    }
  }

  async myCommand(roomId: string, userId: string): Promise<void> {
    try {
      const reply = await this.swineFather.my(roomId, userId);
      await this.publicReply(roomId, userId, reply);
    } catch (e: unknown) {
      this.logger.error(JSON.stringify(e));
      await this.write(roomId, 'Что-то пошло не так...');
    }
  }

  async growCommand(roomId: string, userId: string): Promise<void> {
    try {
      const reply = await this.swineFather.grow(roomId, userId);
      await this.publicReply(roomId, userId, reply);
    } catch (e: unknown) {
      this.logger.error(JSON.stringify(e));
      await this.write(roomId, 'Что-то пошло не так...');
    }
  }

  async topCommand(roomId: string): Promise<void> {
    try {
      const reply = await this.swineFather.top(roomId);
      await this.write(roomId, reply);
    } catch (e: unknown) {
      this.logger.error(JSON.stringify(e));
      await this.write(roomId, 'Что-то пошло не так...');
    }
  }

  async write(roomId: string, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(roomId, message);
    } catch (e: unknown) {
      this.logger.error(JSON.stringify(e));
    }
  }

  private async publicReply(
    roomId: string,
    userId: string,
    message: string,
  ): Promise<void> {
    const chatMember = await this.bot.getChatMember(roomId, Number(userId));

    return this.write(roomId, `@${chatMember.user.username}, ${message}`);
  }
}
