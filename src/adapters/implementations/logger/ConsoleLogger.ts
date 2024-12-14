import { ILogger } from '../../interfaces/ILogger.js';

export class ConsoleLogger implements ILogger {
  context?: string;

  constructor(context?: string) {
    this.context = context; // Сохраняем контекст
  }

  log(message: unknown): void {
    console.log(this.buildMessage(message));
  }

  warn(message: unknown): void {
    console.warn(this.buildMessage(message));
  }

  error(message: unknown): void {
    console.error(this.buildMessage(message));
  }

  private buildMessage(message: unknown): string {
    const time = new Date().toLocaleDateString();
    const text = typeof message === 'string' ? message : JSON.stringify(message);

    return this.context
      ? `${time} [${this.context}]: ${text}`
      : `${time} ${text}`;
  }
}
