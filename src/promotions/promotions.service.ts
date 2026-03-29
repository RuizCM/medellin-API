import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { RedemptionCode } from './redemption-code.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
    @InjectRepository(RedemptionCode)
    private redemptionCodesRepository: Repository<RedemptionCode>,
  ) {}

  async findAll(): Promise<Promotion[]> {
    return this.promotionsRepository.find({
      where: { isActive: true },
      relations: ['place'],
    });
  }

  async findByPlace(placeId: string): Promise<Promotion[]> {
    return this.promotionsRepository.find({
      where: { placeId, isActive: true },
    });
  }

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const promotion = this.promotionsRepository.create(createPromotionDto);
    return this.promotionsRepository.save(promotion);
  }

  async deactivate(id: string): Promise<void> {
    await this.promotionsRepository.update(id, { isActive: false });
  }

  async generateCode(promotionId: string, userId: string): Promise<RedemptionCode> {
    const promotion = await this.promotionsRepository.findOne({
      where: { id: promotionId, isActive: true },
    });
    if (!promotion) {
      throw new NotFoundException('Promoción no encontrada o inactiva');
    }

    const existingCode = await this.redemptionCodesRepository.findOne({
      where: { promotionId, userId },
    });
    if (existingCode) {
      return existingCode;
    }

    const code = uuidv4().split('-')[0].toUpperCase();
    const redemptionCode = this.redemptionCodesRepository.create({
      userId,
      promotionId,
      code,
      status: 'pending',
    });

    return this.redemptionCodesRepository.save(redemptionCode);
  }

  async validateCode(code: string): Promise<{ status: string; message: string }> {
    const redemptionCode = await this.redemptionCodesRepository.findOne({
      where: { code },
      relations: ['promotion'],
    });

    if (!redemptionCode) {
      return { status: 'invalid', message: 'Código inválido' };
    }

    if (redemptionCode.status === 'redeemed') {
      return { status: 'already_redeemed', message: 'Código ya fue redimido' };
    }

    if (!redemptionCode.promotion.isActive) {
      return { status: 'invalid', message: 'La promoción ya no está activa' };
    }

    return { status: 'valid', message: 'Código válido' };
  }

  async redeemCode(code: string): Promise<RedemptionCode | null> {
    const redemptionCode = await this.redemptionCodesRepository.findOne({
      where: { code },
    });

    if (!redemptionCode) {
      throw new NotFoundException('Código no encontrado');
    }

    if (redemptionCode.status === 'redeemed') {
      throw new ConflictException('Código ya fue redimido');
    }

    await this.redemptionCodesRepository.update(redemptionCode.id, {
      status: 'redeemed',
      redeemedAt: new Date(),
    });

    return this.redemptionCodesRepository.findOne({
      where: { id: redemptionCode.id },
    });
  }
}
