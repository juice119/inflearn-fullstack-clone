import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/JwtAuth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayLoad } from 'src/common/JwtUserPayLoad';
import { MyProfileResponseDto } from './dto/MyProfileResponse.dto';
import { UpdateMyProfileRequestDto } from './dto/UpdateMyProfileRequest.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('my-profile')
  @JwtAuth()
  @ApiOkResponse({ description: '내 프로필 조회 성공', type: MyProfileResponseDto })
  async getMyProfile(@User() user: JwtUserPayLoad): Promise<MyProfileResponseDto> {
    const findedUser = await this.userService.findById(user.id);
    return MyProfileResponseDto.from(findedUser);
  }

  @Patch('my-profile')
  @JwtAuth()
  @ApiOkResponse({ description: '내 프로필 수정 성공', type: MyProfileResponseDto })
  async updateMyProfile(
    @User() user: JwtUserPayLoad,
    @Body() updateMyProfileRequestDto: UpdateMyProfileRequestDto,
  ): Promise<MyProfileResponseDto> {
    const updatedUser = await this.userService.updateProfile(user.id, updateMyProfileRequestDto);
    return MyProfileResponseDto.from(updatedUser);
  }
}
