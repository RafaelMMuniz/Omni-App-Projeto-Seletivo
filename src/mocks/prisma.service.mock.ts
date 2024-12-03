import { PrismaService } from 'src/prisma/prisma.service';
import { vi } from 'vitest';

export const prismaServiceMock = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
} as unknown as PrismaService;
