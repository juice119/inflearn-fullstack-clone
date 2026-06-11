import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './common/config/AppConfig.module';
import { CoursesModule } from './courses/courses.module';
import { LecturesModule } from './lectures/lectures.module';
import { PrismaModule } from './prisma/prisma.module';
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
  providers: [],
})
export class AppModule {}
