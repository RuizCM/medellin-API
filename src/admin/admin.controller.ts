import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Estadísticas ──────────────────────────────────────────────────────────
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  // ── Usuarios ──────────────────────────────────────────────────────────────
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Patch('users/:id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  // ── Lugares ───────────────────────────────────────────────────────────────
  @Get('places')
  getPlaces() {
    return this.adminService.getPlaces();
  }

  @Post('places')
  createPlace(@Body() data: any) {
    return this.adminService.createPlace(data);
  }

  @Patch('places/:id')
  updatePlace(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updatePlace(id, data);
  }

  @Patch('places/:id/deactivate')
  deactivatePlace(@Param('id') id: string) {
    return this.adminService.deactivatePlace(id);
  }

  @Delete('places/:id')
  deletePlace(@Param('id') id: string) {
    return this.adminService.deletePlace(id);
  }

  // ── Negocios ──────────────────────────────────────────────────────────────
  @Get('businesses')
  getBusinesses() {
    return this.adminService.getBusinesses();
  }

  @Post('businesses')
  createBusiness(@Body() data: any) {
    return this.adminService.createBusiness(data);
  }

  @Patch('businesses/:id')
  updateBusiness(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateBusiness(id, data);
  }

  @Patch('businesses/:id/deactivate')
  deactivateBusiness(@Param('id') id: string) {
    return this.adminService.deactivateBusiness(id);
  }

  // ── Promociones ───────────────────────────────────────────────────────────
  @Get('promotions')
  getPromotions() {
    return this.adminService.getPromotions();
  }

  @Post('promotions')
  createPromotion(@Body() data: any) {
    return this.adminService.createPromotion(data);
  }

  @Patch('promotions/:id')
  updatePromotion(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updatePromotion(id, data);
  }

  @Patch('promotions/:id/deactivate')
  deactivatePromotion(@Param('id') id: string) {
    return this.adminService.deactivatePromotion(id);
  }

  // ── Códigos ───────────────────────────────────────────────────────────────
  @Get('codes')
  getCodes(@Query('status') status?: string) {
    return this.adminService.getCodes(status);
  }
}