import { Field, FieldTypeEnum } from '../decorators/Field.js';
import { BaseEntity } from './BaseEntity.js';

export class SwineEntity extends BaseEntity<SwineEntity> {
  @Field(FieldTypeEnum.TEXT)
  name?: string;

  constructor(payload?: Partial<SwineEntity>) {
    super()
    Object.assign(this, payload);
  }
}
