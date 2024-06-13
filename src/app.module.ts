import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './layers/user/user.module';
import { AddressesModule } from './layers/adresses/addresses.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UserModule, AddressesModule],
})
export class AppModule {}
