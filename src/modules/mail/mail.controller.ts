import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail-test')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-welcome-email')
  async sendWelcomeEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    try {
      await this.mailService.sendWellcomeMail(user);
      return { message: 'Correo de bienvenida enviado exitosamente' };
    } catch (error) {
      return { message: 'Error al enviar el correo de bienvenida', error };
    }
  }

  @Get('send-confirmation-email')
  async sendConfirmationEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
      confirmationLink: 'http://tuaplicacion.com/confirm?token=abc123',
    };

    try {
      await this.mailService.sendConfirmationMail(user);
      return { message: 'Correo de confirmación enviado exitosamente' };
    } catch (error) {
      return { message: 'Error al enviar el correo de confirmación', error };
    }
  }

  @Get('send-order-email')
  async sendOrderEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    const orderDetails = {
      orderId: '123456',
      items: 'Juego A, Juego B, Juego C',
      total: 59.99,
    };

    try {
      await this.mailService.sendOrderMail(user, orderDetails);
      return { message: 'Correo de pedido enviado exitosamente' };
    } catch (error) {
      return { message: 'Error al enviar el correo de pedido', error };
    }
  }
}
