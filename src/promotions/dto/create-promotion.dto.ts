import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  placeId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  @IsOptional()
  validFrom: string;

  @IsDateString()
  @IsOptional()
  validUntil: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}