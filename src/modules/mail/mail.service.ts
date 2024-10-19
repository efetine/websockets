import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pablobattola@gmail.com',
        pass: 'uyrt jyqg jvfq nien',
      },
    });
  }

  async sendWellcomeMail(user: { email: string; name: string }) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Bienvenido a nuestra aplicación',
      text: `Hola ${user.name},\n\n¡Bienvenido a nuestra aplicación! Nos alegra que estés aquí.`,
      html: `<p>Hola ${user.name},</p><p>¡Bienvenido a nuestra aplicación! Nos alegra que estés aquí.</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado: ${info.messageId}`);
    } catch (error) {
      console.error('Error al enviar correo:', error);
    }
  }

  async sendConfirmationMail(user: {
    email: string;
    name: string;
    confirmationLink: string;
  }) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Confirma tu cuenta',
      text: `Hola ${user.name},\n\nPor favor, confirma tu cuenta haciendo clic en el siguiente enlace: ${user.confirmationLink}`,
      html: `<p>Hola ${user.name},</p><p>Por favor, confirma tu cuenta haciendo clic en el siguiente enlace: <a href="${user.confirmationLink}">Confirmar cuenta</a></p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email de confirmación enviado: ${info.messageId}`);
    } catch (error) {
      console.error('Error al enviar correo de confirmación:', error);
    }
  }

  async sendOrderMail(
    user: { email: string; name: string },
    orderDetails: { orderId: string; items: string; total: number },
  ) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Detalles de tu pedido',
      text: `Hola ${user.name},\n\nGracias por tu pedido!\n\nDetalles del pedido:\n- ID del pedido: ${orderDetails.orderId}\n- Artículos: ${orderDetails.items}\n- Total: $${orderDetails.total.toFixed(2)}\n\n¡Esperamos que disfrutes de tu compra!`,
      html: `<p>Hola ${user.name},</p><p>Gracias por tu pedido!</p><p>Detalles del pedido:</p><ul>
            <li>ID del pedido: ${orderDetails.orderId}</li>
            <li>Artículos: ${orderDetails.items}</li>
            <li>Total: $${orderDetails.total.toFixed(2)}</li>
        </ul><p>¡Esperamos que disfrutes de tu compra!</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email de pedido enviado: ${info.messageId}`);
    } catch (error) {
      console.error('Error al enviar correo de pedido:', error);
    }
  }
}
