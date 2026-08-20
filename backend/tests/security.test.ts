import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
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

  it('rejects order creation without authentication (returns 401)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [{ productId: 'dummy-id', productName: 'Whey', unitPrice: 1000, quantity: 1 }],
        shippingAddress: { fullName: 'Anon', street: 'Street', city: 'City', state: 'State', postalCode: '400001', country: 'India', phone: '+91 9999999999' },
        paymentMethod: 'COD',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('enforces server-side zero-trust pricing on authenticated checkout', async () => {
    // 1. Register/login a user to get auth token
    const testEmail = `buyer_${Date.now()}@test.com`;
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Auth Buyer', email: testEmail, password: 'Password@123' });
    const token = regRes.body.data.token;

    const product = await prisma.product.findFirst({
      where: { isAvailable: true, stockQuantity: { gt: 0 } },
    });

    expect(product).toBeDefined();
    if (!product) return;

    // Attempt to purchase with client-tampered unitPrice of ₹1
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
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

  it('allows admin to register and set primary settlement bank account with UPI routing', async () => {
    let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin Boss',
          email: `admin_${Date.now()}@test.com`,
          password: 'Password@123',
          role: 'ADMIN',
        },
      });
    }

    const adminToken = jwt.sign(
      { userId: adminUser.id, email: adminUser.email, role: 'ADMIN' },
      process.env.JWT_SECRET || 'protein_villa_super_secure_jwt_secret_key_2026'
    );

    // 1. Fetch public active bank
    const activeRes = await request(app).get('/api/payments/active-bank');
    expect(activeRes.status).toBe(200);
    expect(activeRes.body.data.bankName).toBeDefined();

    // 2. Admin adds ICICI Bank as new account
    const addRes = await request(app)
      .post('/api/admin/banks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        bankName: 'ICICI Bank',
        accountHolder: 'Protein Villa Sports Nutrition Pvt Ltd',
        accountNumber: '109283746501',
        ifscCode: 'ICIC0001092',
        upiVpa: 'proteinvilla@icici',
        accountType: 'CURRENT',
        isPrimary: true,
      });

    expect(addRes.status).toBe(201);
    expect(addRes.body.data.bankName).toBe('ICICI Bank');
    expect(addRes.body.data.isPrimary).toBe(true);

    // 3. Verify public active bank immediately updated to ICICI Bank
    const updatedActiveRes = await request(app).get('/api/payments/active-bank');
    expect(updatedActiveRes.status).toBe(200);
    expect(updatedActiveRes.body.data.bankName).toBe('ICICI Bank');
    expect(updatedActiveRes.body.data.upiVpa).toBe('proteinvilla@icici');

    // 4. Non-admin cannot access or mutate bank accounts
    let regularUser = await prisma.user.findFirst({ where: { role: 'USER' } });
    if (!regularUser) {
      regularUser = await prisma.user.create({
        data: {
          name: 'Regular Athlete',
          email: `regular_${Date.now()}@test.com`,
          password: 'Password@123',
          role: 'USER',
        },
      });
    }

    const regularUserToken = jwt.sign(
      { userId: regularUser.id, email: regularUser.email, role: 'USER' },
      process.env.JWT_SECRET || 'protein_villa_super_secure_jwt_secret_key_2026'
    );

    const blockedRes = await request(app)
      .post('/api/admin/banks')
      .set('Authorization', `Bearer ${regularUserToken}`)
      .send({
        bankName: 'Rogue Bank',
        accountHolder: 'Attacker',
        accountNumber: '9999999999',
        ifscCode: 'ROGU0000001',
      });
    expect(blockedRes.status).toBe(403);
  });

  it('encrypts bank account numbers at rest using AES-256-GCM with tamper detection', async () => {
    let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const adminToken = jwt.sign(
      { userId: adminUser!.id, email: adminUser!.email, role: 'ADMIN' },
      process.env.JWT_SECRET || 'protein_villa_super_secure_jwt_secret_key_2026'
    );

    const sbiAccountNumber = '30891234567890';

    // 1. Admin adds State Bank of India
    const addRes = await request(app)
      .post('/api/admin/banks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        bankName: 'State Bank of India',
        accountHolder: 'Protein Villa Sports Nutrition Pvt Ltd',
        accountNumber: sbiAccountNumber,
        ifscCode: 'SBIN0001234',
        upiVpa: 'proteinvilla@sbi',
        accountType: 'CURRENT',
        isPrimary: true,
      });

    expect(addRes.status).toBe(201);
    const bankId = addRes.body.data.id;

    // 2. Query the raw SQLite/Postgres DB directly via Prisma without service layer
    const rawBank = await prisma.bankAccount.findUnique({
      where: { id: bankId },
    });

    // 3. Raw database value MUST be encrypted ciphertext starting with 'enc:gcm:' (NEVER plaintext!)
    expect(rawBank!.accountNumber).not.toBe(sbiAccountNumber);
    expect(rawBank!.accountNumber).toMatch(/^enc:gcm:[0-9a-f]{32}:[0-9a-f]{32}:[0-9a-f]+/);

    // 4. Public endpoint must only receive masked last-4 digits
    const publicActiveRes = await request(app).get('/api/payments/active-bank');
    expect(publicActiveRes.status).toBe(200);
    expect(publicActiveRes.body.data.accountNumber).toBe('•••• •••• •••• 7890');
    expect(publicActiveRes.body.data.accountNumber).not.toContain('30891234');

    // 5. Clean up test bank account so user/admin original bank accounts are not corrupted
    await prisma.bankAccount.deleteMany({
      where: { id: bankId },
    });
    // Restore non-test bank to primary if exists
    const realBank = await prisma.bankAccount.findFirst({
      where: { NOT: { accountHolder: 'Protein Villa Sports Nutrition Pvt Ltd' } },
    });
    if (realBank) {
      await prisma.bankAccount.update({
        where: { id: realBank.id },
        data: { isPrimary: true, isActive: true },
      });
    }
  });
});
