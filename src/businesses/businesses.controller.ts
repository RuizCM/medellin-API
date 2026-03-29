import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.businessesService.getStats(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.businessesService.deactivate(id);
  }
}