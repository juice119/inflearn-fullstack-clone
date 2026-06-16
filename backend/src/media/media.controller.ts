import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/JwtAuth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayLoad } from 'src/common/JwtUserPayLoad';
import { MediaService } from './media.service';

const MAX_FILE_SIZE = 300 * 1024 * 1024;

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  @JwtAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: '이미지, 비디오 파일' },
      },
    },
  })
  @ApiOkResponse({ description: '파일 업로드 성공', type: 'string' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @User() user: JwtUserPayLoad,
  ): Promise<string> {
    if (!file || !file.originalname || !file.buffer) {
      throw new BadRequestException('파일이 없습니다.');
    }

    return await this.mediaService.uploadMediaFile(
      file.originalname,
      file.buffer,
      user.id,
      new Date(),
    );
  }
}
