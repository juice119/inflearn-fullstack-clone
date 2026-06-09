import { Global, Module } from '@nestjs/common';
import { AppConfig } from './AplicationConfig';

@Global()
@Module({
  providers: [
    {
      provide: AppConfig,
      useFactory: () => AppConfig.ofYml(),
    },
  ],
  exports: [AppConfig],
})
export class AppConfigModule {}
