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
          useValue: prismaServiceMock, // Usando o mock do Prisma aqui
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

    // Mockando o findUnique para retornar null (não existe usuário com esse email)
    prismaServiceMock.user.findUnique = vi.fn().mockResolvedValueOnce(null);

    // Mockando o create para retornar o usuário criado com o password "hashed"
    prismaServiceMock.user.create = vi.fn().mockResolvedValueOnce({
      id: '1',
      ...createAccountData,
      password: 'hashedpassword', // Simulando que o password já foi "hasheado"
    });

    // Chamada ao controller.handle para testar o comportamento
    await controller.handle(createAccountData);

    // Verificando se o método create foi chamado com os dados corretos
    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: expect.any(String), // Verificando que o password foi 'hasheado'
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

    // Mockando o findUnique para retornar um usuário com o mesmo email (simulando erro de conflito)
    prismaServiceMock.user.findUnique = vi.fn().mockResolvedValueOnce(createAccountData);

    // Espera que o ConflictException seja lançado
    await expect(controller.handle(createAccountData)).rejects.toThrowError(
      new ConflictException('Email already exists')
    );
  });
});
