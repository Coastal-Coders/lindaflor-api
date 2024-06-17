import { Adresses } from './addresses.model';
import { AddressService } from './addresses.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('api/v1/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body() address: Adresses): Promise<Adresses> {
    return this.addressService.createAddress(address);
  }

  @Get()
  async getAllAddresses(): Promise<Adresses[]> {
    return this.addressService.getAllAddresses();
  }

  @Get(':id')
  async getAddressById(@Param('id') id: string): Promise<Adresses | null> {
    return this.addressService.getAddressById(id);
  }

  @Put(':id')
  async updateAddress(@Param('id') id: string, @Body() address: Adresses): Promise<Adresses> {
    return this.addressService.updateAddress(id, address);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string): Promise<void> {
    await this.addressService.deleteAddress(id);
  }
}
