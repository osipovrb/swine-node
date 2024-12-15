import { SwineEntity } from '../../../entities/SwineEntity.js';
import { daysBetweenDates } from '../../../helpers/DaysBetweenDates.js';
import { IConfig } from '../../interfaces/IConfig.js';
import { ILogger } from '../../interfaces/ILogger.js';
import { IStorage } from '../../interfaces/IStorage.js';
import { ISwineFather } from '../../interfaces/ISwineFather.js';
import { LoggerFactory } from '../logger/LoggerFactory.js';
import { Validator } from './Validator.js';

export class SwineFather implements ISwineFather {
  private readonly logger: ILogger = LoggerFactory(SwineFather.name);

  private readonly validator: Validator;

  constructor(
    private readonly config: IConfig,
    private readonly swineStorage: IStorage<SwineEntity>,
  ) {
    this.logger.log('✓ Started');
    this.validator = new Validator(this.config);
  }

  async name(
    roomId: string,
    userId: string,
    swineName: string,
  ): Promise<string> {
    const validation = this.validator.validateSwineName(swineName);

    if (!validation.isValid) {
      return `так называть свина нельзя: ${validation.errors.join(', ')}`;
    }

    const name = validation.sanitizedValue;

    const [swine] = await this.swineStorage.search({ roomId, userId });

    if (swine) {
      await this.swineStorage.update(swine.id, { name });
      this.logger.log(
        `Swine "${swine.name}" (id ${swine.id}) renamed to "${name}"`,
      );
    } else {
      const { id } = await this.swineStorage.create(
        new SwineEntity({ name, userId, roomId }),
      );
      this.logger.log(`Created new swine "${name}" (id ${id})`);
    }

    return `теперь твоего свина зовут "${swineName}", носи новое имя с гордостью! 🐖`;
  }

  async my(roomId: string, userId: string): Promise<string> {
    const [swine] = await this.swineStorage.search({ roomId, userId });

    if (!swine) {
      return `у тебя ещё нет свина, но ты можешь его завести прямо сейчас! Введи /name <имя_твоего_свина>`;
    }

    const swineAge = daysBetweenDates(new Date(), swine.createdAt);
    return `твоего 🐖 зовут ${swine.name}, его возраст в днях: ${swineAge}`;
  }
}
