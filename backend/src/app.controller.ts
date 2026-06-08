import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards/access-token.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './common/decorators/user.decorator';
import { JwtUserPayLoad } from './common/JwtUserPayLoad';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user-test')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  testUser(@User() user: JwtUserPayLoad) {
    return `유저 이메일 ${user.email}`;
  }
}
