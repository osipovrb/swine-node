export interface IConfig {
  get(key: string): string | undefined;
  getOrThrow(key: string): string;
}
