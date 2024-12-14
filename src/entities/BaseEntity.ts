import { Field, FieldTypeEnum } from '../decorators/Field.js';

export class BaseEntity<T> {
  @Field(FieldTypeEnum.INTEGER)
  id!: number;

  @Field(FieldTypeEnum.DATE)
  createdAt!: Date;

  @Field(FieldTypeEnum.DATE)
  updatedAt!: Date;
}
