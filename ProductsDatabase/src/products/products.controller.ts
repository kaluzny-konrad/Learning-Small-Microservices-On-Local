import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  CreateProductValidator,
  UpdateProductDto,
  UpdateProductValidator,
} from './productDto';
import { Product } from '@prisma/client';
import { fromZodError } from 'zod-validation-error';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const idNumber = Number(id);
    if (isNaN(idNumber))
      throw new BadRequestException(
        'Invalid ID format. Please provide a valid number.',
      );

    const existedProduct = await this.productsService.findOne(idNumber);
    if (existedProduct) return existedProduct;

    throw new NotFoundException('Provided ID not found');
  }

  @Post()
  async create(@Body() createDto: CreateProductDto): Promise<Product> {
    const parsedDto = CreateProductValidator.safeParse(createDto);
    if (!parsedDto.success)
      throw new BadRequestException(fromZodError(parsedDto.error).message);

    const existedProduct = await this.productsService.findByName(
      createDto.name,
    );
    if (existedProduct)
      throw new BadRequestException('Provided name is already existed');

    return await this.productsService.create(createDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<Product> {
    const parsedDto = UpdateProductValidator.safeParse(updateDto);
    if (!parsedDto.success)
      throw new BadRequestException(fromZodError(parsedDto.error).message);

    const idNumber = Number(id);
    if (isNaN(idNumber))
      throw new BadRequestException(
        'Invalid ID format. Please provide a valid number.',
      );

    const existedProduct = await this.productsService.findOne(idNumber);
    if (!existedProduct) throw new NotFoundException('Provided ID not found');

    return await this.productsService.update(idNumber, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException(
        'Invalid ID format. Please provide a valid number.',
      );
    }

    const existedProduct = await this.productsService.findOne(idNumber);
    if (existedProduct) return this.productsService.remove(idNumber);

    throw new NotFoundException('Provided ID not found');
  }
}
