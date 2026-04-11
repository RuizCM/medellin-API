import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Place } from '../places/place.entity';
import { Business } from '../businesses/business.entity';
import { Promotion } from '../promotions/promotion.entity';
import { RedemptionCode } from '../promotions/redemption-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Place, Business, Promotion, RedemptionCode]),
    JwtModule.register({}),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}