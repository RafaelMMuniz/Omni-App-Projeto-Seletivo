import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountController } from './create-account.controller';
import { ConflictException } from '@nestjs/common';
import { vi } from 'vitest';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaServiceMock } from 'src/mocks/prisma.service.mock';

describe('CreateAccountController', () => {
  let controller: CreateAccountController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccountController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CreateAccountController>(CreateAccountController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user when data is valid', async () => {
    const createAccountData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      birthDate: '1990-01-01',
      balance: 100,
    };

    prismaServiceMock.user.findUnique = vi.fn().mockResolvedValueOnce(null);

    prismaServiceMock.user.create = vi.fn().mockResolvedValueOnce({
      id: '1',
      ...createAccountData,
      password: 'hashedpassword',
    });

    await controller.handle(createAccountData);

    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: expect.any(String),
        birthDate: '1990-01-01',
        balance: 100,
      },
    });
  });

  it('should throw ConflictException if email already exists', async () => {
    const createAccountData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      birthDate: '1990-01-01',
      balance: 100,
    };

    prismaServiceMock.user.findUnique = vi.fn().mockResolvedValueOnce(createAccountData);

    await expect(controller.handle(createAccountData)).rejects.toThrowError(
      new ConflictException('Email already exists')
    );
  });
});
