import { Field, FieldTypeEnum } from '../decorators/Field.js';
import { BaseEntity } from './BaseEntity.js';

export class SwineEntity extends BaseEntity<SwineEntity> {
  @Field(FieldTypeEnum.TEXT)
  name!: string;

  @Field(FieldTypeEnum.TEXT)
  userId!: string;

  @Field(FieldTypeEnum.TEXT)
  roomId!: string;

  @Field(FieldTypeEnum.INTEGER)
  weight!: number;

  constructor(payload?: Partial<SwineEntity>) {
    super()
    Object.assign(this, payload);
  }
}
