import { Injectable } from '@nestjs/common';
import { ILoggerProvider } from './logger-provider.interface';

@Injectable()
export class ConsoleLoggerProvider implements ILoggerProvider {
  log(level: 'info' | 'warn' | 'error', message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    if (meta) {
      console.log(logMessage, meta);
    } else {
      console.log(logMessage);
    }
  }
}
