import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from './product.service';

import { createProductDto, updateProductDto } from './product.dto';
import { Product } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { getPrismaService } from 'src/prisma/prisma.singleton';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, { provide: PrismaService, useFactory: getPrismaService }],
    }).compile();
    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to access PrismaService', async () => {
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDtoMock: createProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 10,
        size: 'XS',
        color: 'Red',
      };
      const result: Product = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createProductDtoMock,
      };

      jest.spyOn(prisma.product, 'create').mockResolvedValue(result);

      expect(await service.createProduct(createProductDtoMock)).toEqual(result);
    });
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [
        {
          id: '1',
          name: 'Test Product',
          description: 'This is a test product',
          price: 100,
          stock: 10,
          size: 'XS',
          color: 'Red',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.product, 'findMany').mockResolvedValue(result);

      expect(await service.getAllProducts()).toEqual(result);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const result: Product = {
        id: '1',
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 10,
        size: 'XS',
        color: 'Red',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(result);

      expect(await service.getProductById('1')).toEqual(result);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDtoMock: updateProductDto = {
        name: 'Updated Product',
        description: 'This is an updated product',
        price: 200,
        size: 'S',
        color: 'Blue',
        stock: 5,
      };
      const result: Product = {
        id: '1',
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 10,
        size: 'XS',
        color: 'Red',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...updateProductDtoMock,
      };

      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(result);
      jest.spyOn(prisma.product, 'update').mockResolvedValue(result);

      await expect(service.updateProduct('1', updateProductDtoMock)).resolves.toEqual(result);
    });

    it('should throw a NotFoundException if product to update not found', async () => {
      const updateProductDto: updateProductDto = {
        name: 'Updated Product',
        description: 'This is an updated product',
        price: 200,
        size: 'S',
        color: 'Blue',
        stock: 5,
      };

      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);

      await expect(service.updateProduct('1', updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProductById', () => {
    it('should delete a product', async () => {
      const result: Product = {
        id: '1',
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 10,
        size: 'XS',
        color: 'Red',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.product, 'delete').mockResolvedValue(result);

      expect(await service.deleteProduct('1')).toBeUndefined();
    });
  });
});
