import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { AppConfigModule } from './common/config/AppConfig.module';
import { LecturesModule } from './lectures/lectures.module';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    PrismaModule,
    CoursesModule,
    LecturesModule,
    SectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
