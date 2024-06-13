import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './layers/user/user.module';
import { AddressesModule } from './layers/adresses/addresses.module';
import { CategoryModule } from './layers/category/category.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UserModule, AddressesModule, CategoryModule],
})
export class AppModule {}
