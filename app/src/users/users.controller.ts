import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Users')
@ApiSecurity('X-API-Key')
@Controller()
export class UsersController {
  @Get('me')
  @ApiOperation({ summary: 'Thông tin user hiện tại' })
  getMe(@CurrentUser() user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
