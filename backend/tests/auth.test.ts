import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Auth & API Endpoints', () => {
  it('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('Protein Villa API');
  });

  it('POST /api/auth/login logs in demo user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@proteinvilla.demo', password: 'User@12345' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('USER');
  });

  it('POST /api/auth/login logs in demo admin successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'owner@proteinvilla.demo', password: 'Owner@12345' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('GET /api/admin/analytics rejects unauthorized users without token (401)', async () => {
    const res = await request(app).get('/api/admin/analytics');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/analytics blocks normal USER role with 403 Forbidden', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@proteinvilla.demo', password: 'User@12345' });

    const userToken = loginRes.body.data.token;

    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not authorized');
  });

  it('GET /api/admin/analytics allows ADMIN role', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'owner@proteinvilla.demo', password: 'Owner@12345' });

    const adminToken = loginRes.body.data.token;

    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.kpis).toBeDefined();
  });
});
