import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createAddressesDto, updateAddressesDto } from './addresses.dto';
import { Adresses } from './addresses.model';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async createAddress(data: createAddressesDto) {
    return this.prisma.address.create({
      data,
    });
  }

  async getAllAddresses(): Promise<Adresses[]> {
    return this.prisma.address.findMany();
  }

  async getAddressById(id: string): Promise<Adresses> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async updateAddress(id: string, data: updateAddressesDto): Promise<Adresses> {
    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async deleteAddress(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: { id },
    });
  }
}
