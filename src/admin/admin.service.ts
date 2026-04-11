import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Place } from '../places/place.entity';
import { Business } from '../businesses/business.entity';
import { Promotion } from '../promotions/promotion.entity';
import { RedemptionCode } from '../promotions/redemption-code.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
    @InjectRepository(RedemptionCode)
    private redemptionCodesRepository: Repository<RedemptionCode>,
  ) {}

  // ── Estadísticas ──────────────────────────────────────────────────────────
  async getStats() {
    const totalUsers = await this.usersRepository.count({ where: { role: 'tourist' } });
    const totalPlaces = await this.placesRepository.count({ where: { isActive: true } });
    const totalBusinesses = await this.businessesRepository.count({ where: { isActive: true } });
    const totalPromotions = await this.promotionsRepository.count({ where: { isActive: true } });
    const totalCodes = await this.redemptionCodesRepository.count();
    const redeemedCodes = await this.redemptionCodesRepository.count({ where: { status: 'redeemed' } });

    return {
      totalUsers,
      totalPlaces,
      totalBusinesses,
      totalPromotions,
      totalCodes,
      redeemedCodes,
      pendingCodes: totalCodes - redeemedCodes,
    };
  }

  // ── Usuarios ──────────────────────────────────────────────────────────────
  async getUsers() {
    const users = await this.usersRepository.find({ where: { role: 'tourist' } });
    return users.map(({ password, ...rest }) => rest);
  }

  async updateUser(id: string, data: Partial<User>) {
    await this.usersRepository.update(id, data);   
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return null; 
    const { password, ...rest } = user;
     return rest;
}

  async deactivateUser(id: string) {
    await this.usersRepository.update(id, { isActive: false });
  }

  // ── Lugares ───────────────────────────────────────────────────────────────
  async getPlaces() {
    return this.placesRepository.find();
  }

  async createPlace(data: Partial<Place>) {
    const place = this.placesRepository.create(data);
    return this.placesRepository.save(place);
  }

  async updatePlace(id: string, data: Partial<Place>) {
    await this.placesRepository.update(id, data);
    return this.placesRepository.findOne({ where: { id } });
  }

  async deactivatePlace(id: string) {
    await this.placesRepository.update(id, { isActive: false });
  }

  async deletePlace(id: string) {
    await this.placesRepository.delete(id);
  }

  // ── Negocios ──────────────────────────────────────────────────────────────
  async getBusinesses() {
    const businesses = await this.businessesRepository.find();
    return businesses.map(({ password, ...rest }) => rest);
  }

  async createBusiness(data: Partial<Business>) {
    const business = this.businessesRepository.create(data);
    return this.businessesRepository.save(business);
  }

  async updateBusiness(id: string, data: Partial<Business>) {
    await this.businessesRepository.update(id, data);
    const business = await this.businessesRepository.findOne({ where: { id } });
    if (!business) return null;
    const { password, ...rest } = business;
    return rest;
  }

  async deactivateBusiness(id: string) {
    await this.businessesRepository.update(id, { isActive: false });
  }

  // ── Promociones ───────────────────────────────────────────────────────────
  async getPromotions() {
    return this.promotionsRepository.find({ relations: ['place'] });
  }

  async createPromotion(data: Partial<Promotion>) {
    const promotion = this.promotionsRepository.create(data);
    return this.promotionsRepository.save(promotion);
  }

  async updatePromotion(id: string, data: Partial<Promotion>) {
    await this.promotionsRepository.update(id, data);
    return this.promotionsRepository.findOne({ where: { id }, relations: ['place'] });
  }

  async deactivatePromotion(id: string) {
    await this.promotionsRepository.update(id, { isActive: false });
  }

  // ── Códigos ───────────────────────────────────────────────────────────────
  async getCodes(status?: string) {
    const where = status ? { status } : {};
    return this.redemptionCodesRepository.find({
      where,
      relations: ['promotion', 'user'],
      order: { generatedAt: 'DESC' },
    });
  }
}