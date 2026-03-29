import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { Business } from './business.entity';
import { RedemptionCode } from '../promotions/redemption-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, RedemptionCode])],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}