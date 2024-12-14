export interface ILogger {
  context?: string;
  log(message: unknown): void;
  warn(message: unknown): void;
  error(message: unknown): void;
}
