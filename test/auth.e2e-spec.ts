import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app);
    await app.init();
  });

  it('handles register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Jane',
        email: 'jane2@mail.com',
        password: 'password',
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBe('Jane');
        expect(body.email).toBe('jane2@mail.com');
      });
  });

  it('logged in after register', async () => {
    const email = 'john1@mail.com';

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'john',
        email,
        password: 'password',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
