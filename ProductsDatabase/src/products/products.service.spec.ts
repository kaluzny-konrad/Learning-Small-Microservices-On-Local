import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Product } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './productDto';
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

  describe('findAll', () => {
    it('should return an array of products', async () => {
      // Arrange
      const expectedProducts: Product[] = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          imageName: 'image1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          price: 200,
          imageName: 'image2.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Act
      jest
        .spyOn(prisma.product, 'findMany')
        .mockResolvedValue(expectedProducts);
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedProducts);
      expect(prisma.product.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product with the specified ID if it exists', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct: Product = {
        id: productId,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        imageName: 'image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      jest
        .spyOn(prisma.product, 'findUnique')
        .mockResolvedValue(expectedProduct);
      const result = await service.findOne(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });

    it('should return null if the product with the specified ID does not exist', async () => {
      // Arrange
      const productId = 999;

      // Act
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);
      const result = await service.findOne(productId);

      // Assert
      expect(result).toBeNull();
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });

  describe('findByName', () => {
    it('should return a product with the specified name if it exists', async () => {
      // Arrange
      const productName = 'Product 1';
      const expectedProduct: Product = {
        id: 1,
        name: productName,
        description: 'Description 1',
        price: 100,
        imageName: 'image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      jest
        .spyOn(prisma.product, 'findUnique')
        .mockResolvedValue(expectedProduct);
      const result = await service.findByName(productName);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { name: productName },
      });
    });

    it('should return null if the product with the specified name does not exist', async () => {
      // Arrange
      const productName = 'Non-existent Product';

      // Act
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);
      const result = await service.findByName(productName);

      // Assert
      expect(result).toBeNull();
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { name: productName },
      });
    });
  });

  describe('update', () => {
    it('should update the product with the specified ID and return the updated product', async () => {
      // Arrange
      const productId = 1;
      const updateDto: UpdateProductDto = {
        name: 'Updated Product Name',
        description: 'Updated Product Description',
        price: 150,
        imageName: 'updated_product.jpg',
      };
      const expectedProduct: Product = {
        id: productId,
        name: updateDto.name!,
        description: updateDto.description!,
        price: updateDto.price!,
        imageName: updateDto.imageName!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      jest.spyOn(prisma.product, 'update').mockResolvedValue(expectedProduct);
      const result = await service.update(productId, updateDto);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove the product with the specified ID and return the removed product', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct: Product = {
        id: productId,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        imageName: 'image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      jest.spyOn(prisma.product, 'delete').mockResolvedValue(expectedProduct);
      const result = await service.remove(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });
});
