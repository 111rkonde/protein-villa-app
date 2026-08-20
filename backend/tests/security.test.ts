import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';
import { PaymentService } from '../src/services/payment.service';

describe('Security & Payment Hardening Tests', () => {
  it('prevents mass assignment / privilege escalation during registration', async () => {
    const randomEmail = `hacker_${Date.now()}@test.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Hacker User',
        email: randomEmail,
        password: 'Password@123',
        role: 'ADMIN', // Malicious attempt to self-promote to ADMIN
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // User role MUST remain 'USER', never 'ADMIN'
    expect(res.body.data.user.role).toBe('USER');
  });

  it('rejects invalid payment signatures in PaymentService', () => {
    const isValid = PaymentService.verifyPaymentSignature({
      gatewayOrderId: 'order_test123',
      gatewayPaymentId: 'pay_test456',
      gatewaySignature: 'tampered_signature_abc123',
    });

    expect(isValid).toBe(false);
  });

  it('generates and verifies valid cryptographic payment signatures', () => {
    const sandboxCreds = PaymentService.generateSandboxPaymentSignature('order_demo_1001');
    const isValid = PaymentService.verifyPaymentSignature(sandboxCreds);

    expect(isValid).toBe(true);
  });

  it('enforces server-side zero-trust pricing on checkout', async () => {
    const product = await prisma.product.findFirst({
      where: { isAvailable: true, stockQuantity: { gt: 0 } },
    });

    expect(product).toBeDefined();
    if (!product) return;

    // Attempt to purchase with client-tampered unitPrice of ₹1
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [
          {
            productId: product.id,
            productName: product.name,
            unitPrice: 1, // Client attempted price manipulation
            quantity: 1,
          },
        ],
        shippingAddress: {
          fullName: 'Security Tester',
          street: '123 Security Blvd',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const expectedPrice =
      product.discountPercent > 0
        ? Math.round(product.price * (1 - product.discountPercent / 100))
        : product.price;

    expect(res.body.data.subtotal).toBe(expectedPrice);
  });

  it('successfully tracks orders by orderNumber, trackingNumber, and UUID', async () => {
    const existingOrder = await prisma.order.findFirst();
    expect(existingOrder).toBeDefined();
    if (!existingOrder) return;

    // 1. Track by orderNumber
    const resOrderNum = await request(app).get(`/api/orders/track/${existingOrder.orderNumber}`);
    expect(resOrderNum.status).toBe(200);
    expect(resOrderNum.body.data.orderNumber).toBe(existingOrder.orderNumber);

    // 2. Track by UUID id
    const resId = await request(app).get(`/api/orders/track/${existingOrder.id}`);
    expect(resId.status).toBe(200);
    expect(resId.body.data.orderNumber).toBe(existingOrder.orderNumber);

    // 3. Track lowercase
    const resLower = await request(app).get(`/api/orders/track/${existingOrder.orderNumber.toLowerCase()}`);
    expect(resLower.status).toBe(200);
    expect(resLower.body.data.orderNumber).toBe(existingOrder.orderNumber);
  });

  it('blocks exploit scanners targeting sensitive paths like /.env', async () => {
    const res = await request(app).get('/.env');
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('blocks malicious SQL injection / script injection patterns in URLs', async () => {
    const res = await request(app).get('/api/products?search=<script>alert(1)</script>');
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('scrubs prototype pollution payloads from JSON bodies', async () => {
    const res = await request(app)
      .post('/api/calculator/protein')
      .send({
        age: 25,
        gender: 'male',
        weight: 75,
        height: 178,
        goal: 'muscle_gain',
        activityLevel: 'moderate',
        __proto__: { isAdmin: true },
      });

    expect(res.status).toBe(200);
    // Ensure prototype was not polluted
    expect(({} as any).isAdmin).toBeUndefined();
  });
});
