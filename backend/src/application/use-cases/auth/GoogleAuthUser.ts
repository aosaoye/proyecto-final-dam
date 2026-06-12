import { UserRepository } from '../../../domain/repositories/UserRepository';
import jwt from 'jsonwebtoken';
import https from 'https';

interface GooglePayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}

/**
 * Verifies a Google id_token against Google's public JWKS endpoint
 * without requiring passport or google-auth-library.
 * Falls back to tokeninfo endpoint for simplicity.
 */
async function verifyGoogleToken(idToken: string): Promise<GooglePayload> {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const payload = JSON.parse(data);
          if (payload.error) {
            reject(new Error('Invalid Google token: ' + payload.error_description));
            return;
          }
          if (!payload.email_verified || payload.email_verified === 'false') {
            reject(new Error('Google email not verified'));
            return;
          }
          resolve({
            sub: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            email_verified: payload.email_verified === 'true' || payload.email_verified === true,
          });
        } catch (e) {
          reject(new Error('Failed to parse Google token response'));
        }
      });
    }).on('error', (e) => reject(new Error('Network error verifying Google token: ' + e.message)));
  });
}

export class GoogleAuthUser {
  constructor(private userRepository: UserRepository) {}

  async execute(idToken: string): Promise<{ token: string; user: any }> {
    // 1. Verify token with Google
    const googlePayload = await verifyGoogleToken(idToken);

    // 2. Find or create user
    let user = await this.userRepository.findByEmail(googlePayload.email);

    if (!user) {
      // New user — register via Google (no password needed)
      user = await this.userRepository.save({
        name: googlePayload.name,
        email: googlePayload.email,
        password: undefined, // OAuth users have no local password
        role: 'user',
      });
    }

    // 3. Issue our own JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not configured');

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
