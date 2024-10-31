import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUserService = {
      findAll: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: (name: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          name,
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const user = await service.register(
      'John Doe',
      'john@mail.com',
      'password',
    );

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@mail.com');
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it('should fail to create a user with an existing email', async () => {
    await service.register('John Doe', 'john@mail.com', 'password');
    await expect(
      service.register('John Doe', 'john@mail.com', 'password'),
    ).rejects.toThrow('Email already in use');
  });

  it('should fail if user login with invalid email', async () => {
    await expect(service.login('admin@mail.com', 'password')).rejects.toThrow(
      'Email not registered',
    );
  });

  it('should fail if user login with invalid password', async () => {
    await service.register('John Doe', 'john@mail.com', 'password');

    await expect(service.login('john@mail.com', 'passwords')).rejects.toThrow(
      'Wrong password',
    );
  });

  it('should login existing user', async () => {
    await service.register('John Doe', 'john@mail.com', 'password');
    const user = await service.login('john@mail.com', 'password');
    expect(user).toBeDefined();
  });
});
