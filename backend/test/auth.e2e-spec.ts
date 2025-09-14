import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'password123',
          displayName: 'New User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('User registered successfully');
          expect(res.body.data.user).toHaveProperty('id');
          expect(res.body.data.user.username).toBe('newuser');
          expect(res.body.data.user.email).toBe('newuser@example.com');
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
        });
    });

    it('should return 409 for existing user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com', // This user exists from onModuleInit
          username: 'testuser',
          password: 'password123',
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toContain('already exists');
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid@example.com',
          // missing username and password
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Login successful');
          expect(res.body.data.user).toHaveProperty('id');
          expect(res.body.data.user.username).toBe('testuser');
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Invalid credentials');
        });
    });

    it('should return 401 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Invalid credentials');
        });
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Get a refresh token by logging in
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should refresh tokens with valid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Token refreshed successfully');
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
        });
    });

    it('should return 401 for invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Invalid refresh token');
        });
    });
  });

  describe('Protected routes', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Get an access token by logging in
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    describe('/users/profile (GET)', () => {
      it('should return user profile with valid token', () => {
        return request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.username).toBe('testuser');
            expect(res.body.data.email).toBe('test@example.com');
          });
      });

      it('should return 401 without token', () => {
        return request(app.getHttpServer()).get('/users/profile').expect(401);
      });

      it('should return 401 with invalid token', () => {
        return request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
      });
    });

    describe('/users/profile (PUT)', () => {
      it('should update user profile with valid token', () => {
        return request(app.getHttpServer())
          .put('/users/profile')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            displayName: 'Updated Test User',
            bio: 'Updated bio',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Profile updated successfully');
            expect(res.body.data.displayName).toBe('Updated Test User');
            expect(res.body.data.bio).toBe('Updated bio');
          });
      });
    });
  });
});
