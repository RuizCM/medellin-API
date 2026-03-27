import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.placesService.findByCategory(category);
  }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreatePlaceDto>) {
    return this.placesService.update(id, updateData);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.placesService.deactivate(id);
  }
}
