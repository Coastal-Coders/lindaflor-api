import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [PrismaModule, MulterModule.register({ dest: './uploads' })],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
