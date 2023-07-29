import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from './productDto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({ data });
  }

  async count(): Promise<number> {
    return await this.prisma.product.count();
  }

  async getMany(getProductsDto: GetProductsDto): Promise<Product[]> {
    const { skip, take } = getProductsDto;
    if (!skip || isNaN(skip)) {
      return this.prisma.product.findMany({
        take,
      });
    } else {
      return this.prisma.product.findMany({
        skip,
        take,
      });
    }
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({ where: { name } });
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number): Promise<Product> {
    return await this.prisma.product.delete({ where: { id } });
  }
}
