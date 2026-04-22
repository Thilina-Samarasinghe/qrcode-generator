import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class QrService {
  private readonly secret: string;

  constructor(private readonly config: ConfigService) {
    this.secret = this.config.get<string>('QR_SECRET') || 'default-secret-key';
  }

  async generateQRCode(data: object): Promise<string> {
    const payload = { ...data };
    
    // Generate HMAC signature
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(JSON.stringify(data));
    const signature = hmac.digest('hex');

    // Combine data and signature
    const signedData = {
      ...data,
      signature,
    };

    const json = JSON.stringify(signedData);
    const dataUrl = await QRCode.toDataURL(json, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#0f0f0f',
        light: '#ffffff',
      },
    });
    return dataUrl;
  }

  verifySignature(payload: any): boolean {
    if (!payload || !payload.signature) return false;

    const { signature, ...data } = payload;
    
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(JSON.stringify(data));
    const expectedSignature = hmac.digest('hex');

    return signature === expectedSignature;
  }
}
