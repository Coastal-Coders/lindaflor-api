import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductModule],
  providers: [ProductService, PrismaModule],
})
export class ProductModule {}
