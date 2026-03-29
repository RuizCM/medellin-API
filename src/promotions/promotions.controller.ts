import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get('place/:placeId')
  findByPlace(@Param('placeId') placeId: string) {
    return this.promotionsService.findByPlace(placeId);
  }

  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.promotionsService.deactivate(id);
  }

  @Post(':id/redeem')
  generateCode(
    @Param('id') promotionId: string,
    @Body('userId') userId: string,
  ) {
    return this.promotionsService.generateCode(promotionId, userId);
  }

  @Post('codes/validate')
  validateCode(@Body('code') code: string) {
    return this.promotionsService.validateCode(code);
  }

  @Patch('codes/:code/redeem')
  redeemCode(@Param('code') code: string) {
    return this.promotionsService.redeemCode(code);
  }
}
