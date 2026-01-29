require('dotenv').config(); // Load env vars
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Candidate = require('../models/Candidate');

describe('End-to-End Schema Architecture Test', () => {
    let token;
    let tenantId = 'tenant_A';
    let userEmail = process.env.TEST_USER_EMAIL || 'test.user@trcdemo.com';
    let expectedPassword = process.env.TEST_USER_PASSWORD || 'Trcdemo12!';

    beforeAll(async () => {
        // Connect to DB explicitly for testing
        await mongoose.connect(process.env.MONGO_URI);

        // Cleanup
        await User.deleteMany({ email: userEmail });
        await Campaign.deleteMany({ tenantId });
        await Candidate.deleteMany({ tenantId });

        // Ensure another tenant exists for isolation test
        await User.deleteMany({ email: 'other@other.com' });
        await Campaign.deleteMany({ tenantId: 'tenant_B' });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a user and auto-generate password based on domain', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: userEmail,
                // No password sent!
                role: 'Admin',
                tenantId: tenantId
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should login with the auto-generated password Trcdemo12!', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userEmail,
                password: expectedPassword
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        // Update token just in case
        token = res.body.token;
    });

    it('should create a campaign with flexible schema', async () => {
        const res = await request(app)
            .post('/api/campaigns')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Engineering Campaign',
                status: 'Active',
                schema: {
                    mainSchema: {
                        title: 'Test Engineering Campaign',
                        status: 'Active',
                        department: 'Engineering'
                    },
                    requirements: {
                        skills: ['Node.js', 'React']
                    }
                }
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.schema.mainSchema.title).toBe('Test Engineering Campaign');
    });

    it('should retrieve campaigns for the tenant', async () => {
        const res = await request(app)
            .get('/api/campaigns')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].tenantId).toBe(tenantId);
    });

    it('should enforce multi-tenancy isolation', async () => {
        // Create a user in Tenant B
        const resReg = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'other@other.com',
                password: 'password123',
                role: 'User',
                tenantId: 'tenant_B'
            });

        const tokenB = resReg.body.token;

        // Try to read campaigns with Tenant B token (should see 0, or at least not Tenant A's)
        const res = await request(app)
            .get('/api/campaigns')
            .set('Authorization', `Bearer ${tokenB}`);

        expect(res.statusCode).toEqual(200);
        // Should find 0 campaigns because we only created one for Tenant A
        expect(res.body.length).toBe(0);
    });
});
