import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      login: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user login', async () => {
    const session = {
      userId: -10,
    };
    const user = await controller.login(
      {
        email: 'john@mail.com',
        password: 'password',
      },
      session,
    );

    expect(user).toEqual({
      id: 1,
      email: 'john@mail.com',
      password: 'password',
    });

    expect(session.userId).toEqual(1);
  });
});
