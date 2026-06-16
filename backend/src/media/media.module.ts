import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppConfig } from 'src/common/config/AplicationConfig';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        // 300MB이하 까지만
        fileSize: 300 * 1024 * 1024,
      },
    }),
  ],
  controllers: [MediaController],
  providers: [
    {
      provide: MediaService,
      useFactory: (appConfig: AppConfig) => MediaService.of(appConfig),
      inject: [AppConfig],
    },
  ],
})
export class MediaModule {}
