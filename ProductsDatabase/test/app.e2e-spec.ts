import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Product } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from 'src/products/productDto';

describe('ProdictsController (e2e)', () => {
  let app: INestApplication;
  const productIdsToDelete: number[] = [];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await Promise.all(
      productIdsToDelete.map(
        async (productId) =>
          await request(app.getHttpServer()).delete(`/products/${productId}`),
      ),
    );

    await app.close();
  });

  it('/products (GET) - should return an array of products', async () => {
    // Arrange
    await getCreatedProduct();
    await getCreatedProduct();

    // Act
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    // Assert
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it('/products/:id (GET) - should return a single product when a valid ID is provided', async () => {
    // Arrange
    const product = await getCreatedProduct();

    // Act
    const response = await request(app.getHttpServer())
      .get(`/products/${product.id}`)
      .expect(200);

    // Assert
    expect(response.body).toHaveProperty('id', product.id);
    expect(response.body).toHaveProperty('name', product.name);
    expect(response.body).toHaveProperty('price', product.price);
  });

  it('/products/:id (GET) - should return 404 status when an invalid ID is provided', async () => {
    // Arrange
    const invalidId = 'invalid_id';

    // Act
    const response = await request(app.getHttpServer())
      .get(`/products/${invalidId}`)
      .expect(404);

    // Assert
    expect(response.body).toHaveProperty('statusCode', 404);
  });

  it('/products (POST) - should create a new product with valid data', async () => {
    // Arrange
    const productName = 'Test - New Product' + getRandomString();
    const createDto: CreateProductDto = { name: productName, price: 20 };

    // Act
    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createDto)
      .expect(201);

    // Assert
    productIdsToDelete.push(response.body.id);
    expect(response.body).toHaveProperty('name', createDto.name);
    expect(response.body).toHaveProperty('price', createDto.price);
  });

  it('/products (POST) - should return 400 status when creating a product with an existing name', async () => {
    // Arrange
    const existingProduct = await getCreatedProduct();
    const createProductDto: CreateProductDto = {
      name: existingProduct.name,
      price: 20,
    };

    // Act
    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(400);

    // Assert
    expect(response.body).toHaveProperty('statusCode', 400);
  });

  it('/products/:id (PATCH) - should update an existing product with valid data', async () => {
    // Arrange
    const existingProduct = await getCreatedProduct();
    const updateDto: UpdateProductDto = { price: 25 };

    // Act
    const response = await request(app.getHttpServer())
      .patch(`/products/${existingProduct.id}`)
      .send(updateDto)
      .expect(200);

    // Assert
    expect(response.body).toHaveProperty('id', existingProduct.id);
    expect(response.body).toHaveProperty('name', existingProduct.name);
    expect(response.body).toHaveProperty('price', updateDto.price);
  });

  it('/products/:id (PATCH) - should return 404 status when updating a product with an invalid ID', async () => {
    // Arrange
    const invalidId = 'invalid_id';
    const updateDto: UpdateProductDto = { price: 25 };

    // Act
    const response = await request(app.getHttpServer())
      .patch(`/products/${invalidId}`)
      .send(updateDto)
      .expect(404);

    // Assert
    expect(response.body).toHaveProperty('statusCode', 404);
  });

  it('/products/:id (DELETE) - should delete an existing product', async () => {
    // Arrange
    const existingProduct = await getCreatedProduct();

    // Act
    const response = await request(app.getHttpServer())
      .delete(`/products/${existingProduct.id}`)
      .expect(200);

    // Assert
    expect(response.body).toHaveProperty('id', existingProduct.id);
    expect(response.body).toHaveProperty('name', existingProduct.name);
    expect(response.body).toHaveProperty('price', existingProduct.price);
  });

  it('/products/:id (DELETE) - should return 404 status when deleting a product with an invalid ID', async () => {
    // Arrange
    const invalidId = 'invalid_id';

    // Act
    const response = await request(app.getHttpServer())
      .delete(`/products/${invalidId}`)
      .expect(404);

    // Assert
    expect(response.body).toHaveProperty('statusCode', 404);
  });

  function getRandomString(): string {
    return (Math.random() * (10000 - 1000) + 1000).toString();
  }

  async function getCreatedProduct(): Promise<Product> {
    const productName = 'Test - Create Product' + getRandomString();
    const createDto: CreateProductDto = { name: productName, price: 15 };
    const createResponse = await request(app.getHttpServer())
      .post('/products')
      .send(createDto)
      .expect(201);
    const product: Product = createResponse.body;
    productIdsToDelete.push(product.id);
    return product;
  }
});
