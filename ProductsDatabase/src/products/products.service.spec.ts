import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Product } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ProductsService } from './products.service';
import { CreateProductDto } from './productDto';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    // Assert
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      // Arrange
      const createDto: CreateProductDto = {
        name: 'Product Name',
        description: 'Product Description',
        price: 100,
        imageName: 'product.jpg',
      };
      const expectedProduct: Product = {
        id: 1,
        name: createDto.name,
        description: createDto.description!,
        price: createDto.price,
        imageName: createDto.imageName!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      jest.spyOn(prisma.product, 'create').mockResolvedValue(expectedProduct);
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });
});
