import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/JwtAuth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayLoad } from 'src/common/JwtUserPayLoad';
import { MyProfileResponseDto } from './dto/MyProfileResponse.dto';
import { SignUpRequestDto } from './dto/SignUpRequest.dto';
import { SignUpResponseDto } from './dto/SignUpResponse.dto';
import { UpdateMyProfileRequestDto } from './dto/UpdateMyProfileRequest.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOkResponse({ description: '회원가입 성공', type: SignUpResponseDto })
  async signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const user = await this.userService.signUp(signUpRequestDto);
    return new SignUpResponseDto({
      id: user.id,
      name: user.name,
      email: user.email!,
    });
  }

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
