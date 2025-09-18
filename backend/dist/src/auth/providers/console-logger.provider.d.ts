import { ILoggerProvider } from './logger-provider.interface';
export declare class ConsoleLoggerProvider implements ILoggerProvider {
    log(level: 'info' | 'warn' | 'error', message: string, meta?: any): void;
}
