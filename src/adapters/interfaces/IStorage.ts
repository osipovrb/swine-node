export interface IStorage<T> {
  create(entity: T): Promise<T>;
  find(id: number): Promise<T | null>;
  update(id: number, entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
