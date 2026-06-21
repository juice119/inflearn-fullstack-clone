import { Global, Module } from '@nestjs/common';
import { AppConfig } from './AplicationConfig';

@Global()
@Module({
  providers: [
    {
      provide: AppConfig,
      useFactory: () => AppConfig.ofYml(process.env.NODE_ENV || 'local'),
    },
  ],
  exports: [AppConfig],
})
export class AppConfigModule {}
