import { Module } from '@nestjs/common';
import { AddressController } from './addresses.controller';
import { AddressService } from './addresses.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AddressController],
  providers: [AddressService, PrismaService],
})
export class AddressesModule {}
