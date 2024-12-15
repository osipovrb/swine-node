import { MealEntity } from '../../../entities/MealEntity.js';
import { SwineEntity } from '../../../entities/SwineEntity.js';
import { daysBetweenDates } from '../../../helpers/DaysBetweenDates.js';
import { format } from '../../../helpers/format.js';
import { pluralize, PLURALIZE_DAYS } from '../../../helpers/pluralize.js';
import { random } from '../../../helpers/random.js';
import { todayDates } from '../../../helpers/today-dates.js';
import { IConfig } from '../../interfaces/IConfig.js';
import { ILogger } from '../../interfaces/ILogger.js';
import { IStorage } from '../../interfaces/IStorage.js';
import { ISwineDict } from '../../interfaces/ISwineDict.js';
import { ISwineFather } from '../../interfaces/ISwineFather.js';
import { LoggerFactory } from '../logger/LoggerFactory.js';
import { Validator } from './Validator.js';

export class SwineFather implements ISwineFather {
  private readonly logger: ILogger = LoggerFactory(SwineFather.name);

  private readonly validator: Validator;

  constructor(
    private readonly config: IConfig,
    private readonly swineStorage: IStorage<SwineEntity>,
    private readonly mealStorage: IStorage<MealEntity>,
    private readonly dict: ISwineDict,
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
      return validation.errors.join(', ');
    }

    const name = validation.sanitizedValue;

    const [swine] = await this.swineStorage.search([
      { field: 'roomId', value: roomId },
      { field: 'userId', value: userId },
    ]);

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

    return format(this.dict.SWINE_RENAMED, swineName);
  }

  async my(roomId: string, userId: string): Promise<string> {
    const [swine] = await this.swineStorage.search([
      { field: 'roomId', value: roomId },
      { field: 'userId', value: userId },
    ]);

    if (!swine) {
      return format(this.dict.SWINE_NOT_EXISTS);
    }

    const swineAge = daysBetweenDates(new Date(), swine.createdAt);

    return format(
      this.dict.SWINE_OVERVIEW,
      swine.name,
      swineAge,
      pluralize(swineAge, PLURALIZE_DAYS),
    );
  }

  async grow(roomId: string, userId: string): Promise<string> {
    // get swine
    const [swine] = await this.swineStorage.search([
      { field: 'roomId', value: roomId },
      { field: 'userId', value: userId },
    ]);

    if (!swine) {
      return format(this.dict.SWINE_NOT_EXISTS);
    }

    // check if swine can have a meal
    const today = todayDates();
    const todayMeals = await this.mealStorage.search([
      { field: 'swineId', value: swine.id },
      { field: 'createdAt', operator: '>=', value: today.dayStart },
      { field: 'createdAt', operator: '<=', value: today.dayEnd },
    ]);

    const validation = this.validator.validateSwineGrow(todayMeals.length);
    if (!validation.isValid) {
      return validation.errors.join(',');
    }

    // swine is having a nice smelly meal
    const mealWeight = random(1, 30);
    const mealEntity = new MealEntity({ mealWeight, swineId: swine.id });
    const swineWeight = swine.weight + mealWeight;
    await Promise.all([
      this.mealStorage.create(mealEntity),
      this.swineStorage.update(swine.id, { weight: swineWeight }),
    ]);

    return format(this.dict.SWINE_GROW, swine.name, mealWeight, swineWeight);
  }
}
