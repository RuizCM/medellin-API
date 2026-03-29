import { Controller, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/preferences')
  updatePreferences(
    @Param('id') id: string,
    @Body() preferences: User['preferences'],
  ) {
    return this.usersService.updatePreferences(id, preferences);
  }
}