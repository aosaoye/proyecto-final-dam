"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class EmailService {
    transporter;
    constructor() {
        // Validate variables exist
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        if (!user || !pass) {
            console.warn('⚠️  ALERTA: SMTP_USER y SMTP_PASS no están configurados en .env. Los correos no se enviarán realmente.');
        }
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: user,
                pass: pass,
            },
        });
    }
    async sendResetCode(toEmail, code) {
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
        }
        catch (error) {
            console.error('❌ Error al enviar el email real:', error.message);
            return false;
        }
    }
}
exports.EmailService = EmailService;
