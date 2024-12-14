import 'reflect-metadata';

export const FIELDS_METADATA_KEY = 'fields';

export interface IFieldData {
  name: string;
  type: FieldTypeEnum;
}

export enum FieldTypeEnum {
  TEXT = 'TEXT',
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  DATE = 'DATE',
}

/** exposes class fields names and types */
export function Field(type: FieldTypeEnum): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol): void {
    if (type === undefined) {
      throw new Error('Field type cannot be undefined');
    }

    const existingFields: IFieldData[] =
      Reflect.getMetadata(FIELDS_METADATA_KEY, target) || [];

    existingFields.push({ name: String(propertyKey), type });

    Reflect.defineMetadata(FIELDS_METADATA_KEY, existingFields, target);
  };
}
