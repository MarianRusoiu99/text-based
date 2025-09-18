import { Injectable } from '@nestjs/common';
import { IEmailProvider } from './email-provider.interface';

@Injectable()
export class ConsoleEmailProvider implements IEmailProvider {
  async sendEmail(options: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<void> {
    console.log('📧 EMAIL WOULD BE SENT:', {
      to: options.to,
      subject: options.subject,
      hasHtml: !!options.html,
      hasText: !!options.text,
    });

    if (options.text) {
      console.log('📄 TEXT CONTENT:', options.text);
    }

    // Simulate async email sending
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
