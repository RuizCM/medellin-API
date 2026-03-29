import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { RedemptionCode } from '../promotions/redemption-code.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(RedemptionCode)
    private redemptionCodesRepository: Repository<RedemptionCode>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<Omit<Business, 'password'>> {
    const hashedPassword = await bcrypt.hash(createBusinessDto.password, 12);
    const business = this.businessesRepository.create({
      ...createBusinessDto,
      password: hashedPassword,
    });
    const saved = await this.businessesRepository.save(business);
    const { password, ...result } = saved;
    return result;
  }

  async findAll(): Promise<Omit<Business, 'password'>[]> {
    const businesses = await this.businessesRepository.find({ where: { isActive: true } });
    return businesses.map(({ password, ...rest }) => rest);
  }

  async findOne(id: string): Promise<Business> {
    const business = await this.businessesRepository.findOne({ where: { id } });
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }
    return business;
  }

  async getStats(businessId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRedeemed = await this.redemptionCodesRepository
      .createQueryBuilder('rc')
      .innerJoin('rc.promotion', 'p')
      .innerJoin('p.place', 'pl')
      .where('pl.businessId = :businessId', { businessId })
      .andWhere('rc.status = :status', { status: 'redeemed' })
      .andWhere('rc.redeemedAt >= :today', { today })
      .getCount();

    const totalGenerated = await this.redemptionCodesRepository
      .createQueryBuilder('rc')
      .innerJoin('rc.promotion', 'p')
      .innerJoin('p.place', 'pl')
      .where('pl.businessId = :businessId', { businessId })
      .getCount();

    const totalRedeemed = await this.redemptionCodesRepository
      .createQueryBuilder('rc')
      .innerJoin('rc.promotion', 'p')
      .innerJoin('p.place', 'pl')
      .where('pl.businessId = :businessId', { businessId })
      .andWhere('rc.status = :status', { status: 'redeemed' })
      .getCount();

    return {
      todayRedeemed,
      totalGenerated,
      totalRedeemed,
      pendingRedemption: totalGenerated - totalRedeemed,
    };
  }

  async deactivate(id: string): Promise<void> {
    await this.businessesRepository.update(id, { isActive: false });
  }
}