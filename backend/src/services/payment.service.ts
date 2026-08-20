import crypto from 'crypto';
import { ENV } from '../config/env';

export interface PaymentIntentOptions {
  amount: number; // In Rupees
  currency?: string;
  orderNumber: string;
  userId?: string;
  customerEmail?: string;
  paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'COD';
}

export interface PaymentVerificationPayload {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

export class PaymentService {
  private static readonly SECRET_KEY = ENV.JWT_SECRET || 'pv_secure_payment_salt_2026';

  /**
   * Generates a cryptographically secure Payment Intent with an HMAC signature
   */
  static createPaymentIntent(options: PaymentIntentOptions) {
    const { amount, currency = 'INR', orderNumber, paymentMethod } = options;
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString('hex');
    const gatewayOrderId = `order_${crypto.createHash('sha256').update(`${orderNumber}_${timestamp}_${nonce}`).digest('hex').slice(0, 16)}`;

    // Create tamper-proof HMAC signature for the payment intent
    const payload = `${gatewayOrderId}|${amount}|${currency}|${orderNumber}|${timestamp}`;
    const hmac = crypto.createHmac('sha256', this.SECRET_KEY).update(payload).digest('hex');

    return {
      gatewayOrderId,
      amount,
      currency,
      paymentMethod,
      orderNumber,
      timestamp,
      nonce,
      signature: hmac,
    };
  }

  /**
   * Timing-safe verification of payment gateway callback / webhook signature
   */
  static verifyPaymentSignature(payload: PaymentVerificationPayload): boolean {
    try {
      const { gatewayOrderId, gatewayPaymentId, gatewaySignature } = payload;
      if (!gatewayOrderId || !gatewayPaymentId || !gatewaySignature) {
        return false;
      }

      const expectedPayload = `${gatewayOrderId}|${gatewayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.SECRET_KEY)
        .update(expectedPayload)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
      const actualBuffer = Buffer.from(gatewaySignature, 'utf-8');

      if (expectedBuffer.length !== actualBuffer.length) {
        return false;
      }

      // Timing-safe comparison to prevent side-channel timing attacks
      return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
    } catch {
      return false;
    }
  }

  /**
   * Generates a mock verified payment payload for sandbox / demo testing
   */
  static generateSandboxPaymentSignature(gatewayOrderId: string) {
    const gatewayPaymentId = `pay_${crypto.randomBytes(12).toString('hex')}`;
    const payload = `${gatewayOrderId}|${gatewayPaymentId}`;
    const gatewaySignature = crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(payload)
      .digest('hex');

    return {
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
    };
  }
}
