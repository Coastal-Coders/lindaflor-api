import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './layers/user/user.module';
import { AddressesModule } from './layers/adresses/addresses.module';
import { CategoryModule } from './layers/category/category.module';
import { ProductModule } from './layers/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    ProductModule,
    AddressesModule,
    CategoryModule,
  ],
})
export class AppModule {}
