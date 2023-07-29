import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

describe('PrismaService', () => {
  let service: PrismaService;
  let prismaMock: PrismaClient;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: PrismaClient, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    // Assert
    expect(service).toBeDefined();
  });

  it('should call $connect on module init', async () => {
    // Act
    await service.onModuleInit();
  });
});
