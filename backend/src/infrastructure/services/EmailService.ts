import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  private transporter;

  constructor() {
    // Validate variables exist
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    
    if (!user || !pass) {
      console.warn('⚠️  ALERTA: SMTP_USER y SMTP_PASS no están configurados en .env. Los correos no se enviarán realmente.');
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  async sendResetCode(toEmail: string, code: string): Promise<boolean> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ No se puede enviar correo: Faltan credenciales en el archivo .env');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: `"Modsy Support" <${process.env.SMTP_USER}>`, 
        to: toEmail,
        subject: "🔒 Recuperación de tu contraseña - Código de Seguridad",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1c1917; text-align: center;">Seguridad de la cuenta</h2>
            <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código de un solo uso para continuar con el proceso:</p>
            <div style="background: #f4f4f5; padding: 20px; text-align: center; font-size: 24px; font-weight: 800; color: #18181b; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
              ${code}
            </div>
            <p style="color: #71717a; font-size: 13px;">Este código caducará en 15 minutos por razones de seguridad. Si no has solicitado este cambio, ignora este mensaje.</p>
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
            <small style="color: #a1a1aa;">Modsy. Furniture Designed For You.</small>
          </div>
        `,
      });
      return true;
    } catch (error: any) {
      console.error('❌ Error al enviar el email real:', error.message);
      return false;
    }
  }
}
