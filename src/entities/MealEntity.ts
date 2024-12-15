import { Field, FieldTypeEnum } from '../decorators/Field.js';
import { BaseEntity } from './BaseEntity.js';

export class MealEntity extends BaseEntity<MealEntity> {
  @Field(FieldTypeEnum.INTEGER)
  swineId!: number;

  @Field(FieldTypeEnum.INTEGER)
  mealWeight!: number;

  constructor(payload?: Partial<MealEntity>) {
    super()
    Object.assign(this, payload);
  }
}
