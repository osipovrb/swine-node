import { pluralize, PLURALIZE_TIMES } from '../../../helpers/pluralize.js';
import { IConfig } from '../../interfaces/IConfig.js';

export interface IValidationResult<T> {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: T;
}

export class Validator {
  public minSwineNameLength: number;
  public maxSwineNameLength: number;
  public maxMealsPerDay: number;

  constructor(private readonly config: IConfig) {
    this.minSwineNameLength = Number(
      this.config.get('MIN_SWINE_NAME_LENGTH') ?? 3,
    );

    this.maxSwineNameLength = Number(
      this.config.get('MAX_SWINE_NAME_LENGTH') ?? 3,
    );

    this.maxMealsPerDay = Number(this.config.get('MAX_MEALS_PER_DAY') ?? 1);
  }

  validateSwineName(name: string): IValidationResult<string> {
    const errors = [];

    const sanitizedValue = name.trim();

    if (sanitizedValue.length < this.minSwineNameLength) {
      errors.push(
        `длина имени хряка должно быть больше ${this.minSwineNameLength} символов`,
      );
    }

    if (sanitizedValue.length > this.maxSwineNameLength) {
      errors.push(
        `длина имени хряка должна быть меньше ${this.maxSwineNameLength} символов`,
      );
    }

    return { isValid: errors.length === 0, errors, sanitizedValue };
  }

  validateSwineGrow(mealCount: number): IValidationResult<null> {
    const errors = [];

    if (mealCount >= this.maxMealsPerDay) {
      errors.push(
        `твой хряк уже кушал сегодня! Хряка можно кормить ${this.maxMealsPerDay} ${pluralize(this.maxMealsPerDay, PLURALIZE_TIMES)} в день`,
      );
    }

    return { isValid: errors.length === 0, errors };
  }
}
