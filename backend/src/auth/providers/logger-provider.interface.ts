export interface ILoggerProvider {
  log(level: 'info' | 'warn' | 'error', message: string, meta?: any): void;
}
