export interface IStorage<T> {
  create(entity: T): Promise<T>;
  find(id: number): Promise<T | null>;
  search(criteria: IStorageSearchCriteria<T>[]): Promise<T[]>;
  update(id: number, entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

export interface IStorageSearchCriteria<T> {
  field: keyof T;
  operator?: TStorageSearchOperator;
  value: unknown;
}

export type TStorageSearchOperator = '=' | '>' | '<' | '>=' | '<=';

export type TStorageSearchGlue = 'AND' | 'OR';
