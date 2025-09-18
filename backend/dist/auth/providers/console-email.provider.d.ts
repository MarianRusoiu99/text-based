import { IEmailProvider } from './email-provider.interface';
export declare class ConsoleEmailProvider implements IEmailProvider {
    sendEmail(options: {
        to: string;
        subject: string;
        html?: string;
        text?: string;
    }): Promise<void>;
}
