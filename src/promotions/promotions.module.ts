import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { Promotion } from './promotion.entity';
import { RedemptionCode } from './redemption-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, RedemptionCode])],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
