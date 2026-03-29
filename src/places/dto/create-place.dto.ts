import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  photoUrl: string;

  @IsString()
  schedule: string;

  @IsString()
  priceRange: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsArray()
  @IsOptional()
  ambiente: string[];

  @IsString()
  @IsOptional()
  businessId: string;
}