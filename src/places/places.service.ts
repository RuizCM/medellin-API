import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
  ) {}

  async findAll(): Promise<Place[]> {
    return this.placesRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Place> {
    const place = await this.placesRepository.findOne({ where: { id, isActive: true } });
    if (!place) {
      throw new NotFoundException('Lugar no encontrado');
    }
    return place;
  }

  async findByCategory(category: string): Promise<Place[]> {
    return this.placesRepository.find({ where: { category, isActive: true } });
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const place = this.placesRepository.create(createPlaceDto);
    return this.placesRepository.save(place);
  }

  async update(id: string, updateData: Partial<CreatePlaceDto>): Promise<Place> {
    await this.placesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async deactivate(id: string): Promise<void> {
    await this.placesRepository.update(id, { isActive: false });
  }
}