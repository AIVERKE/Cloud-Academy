import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendSubmissionConfirmation(email: string, name: string, taskTitle: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmación de Entrega - Cloud Academy',
        template: './entrega-confirmada',
        context: {
          name: name,
          taskTitle: taskTitle,
        },
      });
      this.logger.log(`Email de confirmación enviado a ${email} para la tarea "${taskTitle}"`);
    } catch (error) {
      this.logger.error(`Error enviando email a ${email}: ${error.message}`, error.stack);
    }
  }
}
