import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@prisma/client';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './productDto';

describe('ProductsController', () => {
  let controller: ProductsController;
  const serviceMock = {
    count: jest.fn(),
    getMany: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as any as ProductsService;

  const product1: Product = {
    id: 1,
    name: 'Product Name',
    description: 'Product Description',
    price: 100,
    imageName: 'product.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const product2: Product = {
    id: 2,
    name: 'Product Name2',
    description: 'Product Description2',
    price: 200,
    imageName: 'product2.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  function getCorrectProducts(): Product[] {
    return [product1, product2];
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('count', () => {
    it('should return the number of products', async () => {
      const expectedCount: number = 10;

      jest.spyOn(serviceMock, 'count').mockResolvedValue(expectedCount);

      expect(await controller.count()).toEqual(expectedCount);
    });
  });

  describe('getMany', () => {
    it('should return an array of products without skip and take', async () => {
      const expectedProducts: Product[] = getCorrectProducts();

      jest.spyOn(serviceMock, 'getMany').mockResolvedValue(expectedProducts);

      expect(await controller.getMany(undefined, undefined)).toEqual(
        expectedProducts,
      );
    });

    it('should return an array of products with skip and take', async () => {
      const expectedProducts: Product[] = getCorrectProducts();
      const skip = 1;
      const take = 2;

      jest.spyOn(serviceMock, 'getMany').mockResolvedValue(expectedProducts);

      expect(await controller.getMany(skip, take)).toEqual(expectedProducts);
    });

    it('should throw BadRequestException if query parameters are invalid', async () => {
      const skip: any = 'abc';
      const take: any = 'xyz';

      await expect(controller.getMany(skip, take)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should return an array of products with skip and without take', async () => {
      // Arrange
      const expectedProducts: Product[] = getCorrectProducts();
      const params = {
        skip: 1,
      };

      // Act
      jest.spyOn(serviceMock, 'getMany').mockResolvedValue(expectedProducts);
      const result = await controller.getMany(params.skip, undefined);

      // Assert
      expect(result).toEqual(expectedProducts);
      expect(serviceMock.getMany).toHaveBeenCalledWith(params);
    });

    it('should return an array of products without skip and with take', async () => {
      // Arrange
      const expectedProducts: Product[] = getCorrectProducts();
      const params = {
        take: 2,
      };

      // Act
      jest.spyOn(serviceMock, 'getMany').mockResolvedValue(expectedProducts);
      const result = await controller.getMany(undefined, params.take);

      // Assert
      expect(result).toEqual(expectedProducts);
      expect(serviceMock.getMany).toHaveBeenCalledWith(params);
    });

    it('should return no products if skip is greater than the number of products', async () => {
      // Arrange
      const expectedProducts: Product[] = [];
      const params = {
        skip: 10,
      };

      // Act
      jest.spyOn(serviceMock, 'getMany').mockResolvedValue(expectedProducts);
      const result = await controller.getMany(params.skip, undefined);

      // Assert
      expect(result).toEqual(expectedProducts);
      expect(serviceMock.getMany).toHaveBeenCalledWith(params);
    });

    it('should throw BadRequestException if take is 0', async () => {
      // Arrange
      const params = {
        take: 0,
      };

      // Act
      await expect(
        controller.getMany(undefined, params.take),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should return all products if take is more than the number of products', async () => {
      // Arrange
      const expectedProducts: Product[] = getCorrectProducts();
      const params = {
        take: 10,
      };

      // Act
      jest.spyOn(serviceMock, 'getMany').mockResolvedValue(expectedProducts);
      const result = await controller.getMany(undefined, params.take);

      // Assert
      expect(result).toEqual(expectedProducts);
      expect(serviceMock.getMany).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      jest.spyOn(serviceMock, 'findOne').mockResolvedValue(product1);

      const result = await controller.findOne('1');
      expect(result).toEqual(product1);
      expect(result).not.toEqual(product2);
    });

    it('should throw NotFoundException if product with given ID does not exist', async () => {
      jest.spyOn(serviceMock, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if provided ID is not a valid number', async () => {
      await expect(controller.findOne('abc')).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const newProduct: CreateProductDto = {
        name: 'Product Name',
        description: 'Product Description',
        price: 100,
        imageName: 'product.jpg',
      };
      const createdProduct: Product = {
        id: 3,
        name: newProduct.name,
        description: newProduct.description!,
        price: newProduct.price!,
        imageName: newProduct.imageName!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(serviceMock, 'findByName').mockResolvedValue(null);
      jest.spyOn(serviceMock, 'create').mockResolvedValue(createdProduct);

      expect(await controller.create(newProduct)).toEqual(createdProduct);
    });

    it('should throw BadRequestException if product with the same name already exists', async () => {
      const existingProduct: Product = {
        id: 1,
        name: 'Existing Product',
        description: 'Description',
        price: 100,
        imageName: 'imageName.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newProduct: CreateProductDto = {
        name: existingProduct.name,
        description: 'Other Description',
        price: 200,
        imageName: 'otherimageName.jpg',
      };

      jest.spyOn(serviceMock, 'findByName').mockResolvedValue(existingProduct);

      await expect(controller.create(newProduct)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if name is empty', async () => {
      const newProduct: CreateProductDto = {
        name: '',
        description: 'Description',
        price: 100,
        imageName: 'imageName.jpg',
      };

      await expect(controller.create(newProduct)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if name is not provided', async () => {
      const newProduct: CreateProductDto = {
        name: null!,
        description: 'Description',
        price: 100,
        imageName: 'imageName.jpg',
      };

      await expect(controller.create(newProduct)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if name is less than 3 characters', async () => {
      const newProduct: CreateProductDto = {
        name: '12',
        description: 'Description',
        price: 100,
        imageName: 'imageName.jpg',
      };

      await expect(controller.create(newProduct)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if name is more than 200 characters', async () => {
      const newProduct: CreateProductDto = {
        name: 'a'.repeat(201),
        description: 'Description',
        price: 100,
        imageName: 'imageName.jpg',
      };

      await expect(controller.create(newProduct)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateData: UpdateProductDto = { description: 'New Description' };
      const updatedProduct: Product = {
        id: product1.id,
        name: product1.name,
        description: updateData.description!,
        price: product1.price,
        imageName: product1.imageName,
        createdAt: product1.createdAt,
        updatedAt: new Date(),
      };

      jest.spyOn(serviceMock, 'findOne').mockResolvedValue(product1);
      jest.spyOn(serviceMock, 'update').mockResolvedValue(updatedProduct);

      expect(await controller.update('1', updateData)).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product with given ID does not exist', async () => {
      const updateData: UpdateProductDto = { description: 'New Description' };
      jest.spyOn(serviceMock, 'findOne').mockResolvedValue(null);

      await expect(controller.update('999', updateData)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if provided ID is not a valid number', async () => {
      const updateData = { description: 'New Description' };
      await expect(controller.update('abc', updateData)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when updateDto is invalid', async () => {
      const invalidUpdateData: UpdateProductDto = {
        description: 'New Description',
        price: -1,
      };

      jest.spyOn(serviceMock, 'findOne').mockResolvedValue(product1);

      await expect(
        controller.update('1', invalidUpdateData),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      jest.spyOn(serviceMock, 'findOne').mockResolvedValue(product1);
      jest.spyOn(serviceMock, 'remove').mockResolvedValue(product1);

      expect(await controller.remove('1')).toEqual(product1);
    });

    it('should throw NotFoundException if product with given ID does not exist', async () => {
      jest.spyOn(serviceMock, 'findOne').mockResolvedValue(null);

      await expect(controller.remove('999')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if provided ID is not a valid number', async () => {
      await expect(controller.remove('abc')).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
