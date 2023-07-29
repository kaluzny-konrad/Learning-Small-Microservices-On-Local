# Repo info

## Installation

```bash
`$ npm install`
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Coverage

```text
> jest --coverage

 PASS  src/prisma/prisma.service.spec.ts
  PrismaService
    √ should be defined (46 ms)
    √ should call $connect on module init (27 ms)

 PASS  src/main.spec.ts (5.933 s)
  App Bootstrap
    √ it bootstraps and launches the application (10 ms)

 PASS  src/products/products.service.spec.ts (5.979 s)
  ProductsService
    √ should be defined (26 ms)
    create
      √ should create a new product (6 ms)
      √ should create a new product without description and imageName (5 ms)
    count
      √ should return the number of products (4 ms)
    getMany
      √ should return an array of products without skip and take (3 ms)
      √ should return an array of products with skip and take (4 ms)
      √ should return an array of products with skip and without take (3 ms)
      √ should return an array of products without skip and with take (3 ms)
      √ should return no products if skip is greater than the number of products (4 ms)
      √ should return no products if take is 0 (3 ms)
      √ should return all products if take is more than the number of products (3 ms)
    findOne
      √ should return a product with the specified ID if it exists (2 ms)
      √ should return null if the product with the specified ID does not exist (2 ms)
    findByName
      √ should return a product with the specified name if it exists (7 ms)
      √ should return null if the product with the specified name does not exist (2 ms)
    update
      √ should update the product with the specified ID and return the updated product (3 ms)
      √ should return null if the product with the specified ID does not exist (3 ms)
    remove
      √ should remove the product with the specified ID and return the removed product (2 ms)

 PASS  src/app.module.spec.ts (5.997 s)
  AppModule
    √ should validate the app module (32 ms)

 PASS  src/products/products.controller.spec.ts (6.171 s)
  ProductsController
    √ should be defined (15 ms)
    count
      √ should return the number of products (3 ms)
    getMany
      √ should return an array of products without skip and take (3 ms)
      √ should return an array of products with skip and take (2 ms)
      √ should throw BadRequestException if query parameters are invalid (19 ms)
      √ should return an array of products with skip and without take (3 ms)
      √ should return an array of products without skip and with take (2 ms)
      √ should return no products if skip is greater than the number of products (2 ms)
      √ should throw BadRequestException if take is 0 (3 ms)
      √ should return all products if take is more than the number of products (2 ms)
    findOne
      √ should return a product by ID (2 ms)
      √ should throw NotFoundException if product with given ID does not exist (4 ms)
      √ should throw BadRequestException if provided ID is not a valid number (2 ms)
    create
      √ should create a new product (2 ms)
      √ should throw BadRequestException if product with the same name already exists (1 ms)
      √ should throw BadRequestException if name is empty (2 ms)
      √ should throw BadRequestException if name is not provided (2 ms)
      √ should throw BadRequestException if name is less than 3 characters (2 ms)
      √ should throw BadRequestException if name is more than 200 characters (1 ms)
    update
      √ should update an existing product (2 ms)
      √ should throw NotFoundException if product with given ID does not exist (1 ms)
      √ should throw BadRequestException if provided ID is not a valid number (2 ms)
      √ should throw BadRequestException when updateDto is invalid (1 ms)
    remove
      √ should delete a product (1 ms)
      √ should throw NotFoundException if product with given ID does not exist (1 ms)
      √ should throw BadRequestException if provided ID is not a valid number (2 ms)

-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |     100 |      100 |     100 |     100 |
 src                     |     100 |      100 |     100 |     100 |
  app.module.ts          |     100 |      100 |     100 |     100 |
  main.ts                |     100 |      100 |     100 |     100 |
 src/prisma              |     100 |      100 |     100 |     100 |
  prisma.module.ts       |     100 |      100 |     100 |     100 |
  prisma.service.ts      |     100 |      100 |     100 |     100 |
 src/products            |     100 |      100 |     100 |     100 |
  productDto.ts          |     100 |      100 |     100 |     100 |
  products.controller.ts |     100 |      100 |     100 |     100 |
  products.module.ts     |     100 |      100 |     100 |     100 |
  products.service.ts    |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|-------------------
Test Suites: 5 passed, 5 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        6.876 s
Ran all test suites.
```
