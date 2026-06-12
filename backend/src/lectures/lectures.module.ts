import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SectionsModule } from 'src/sections/sections.module';
import { LecturesController } from './lectures.controller';
import { LecturesService } from './lectures.service';

@Module({
  imports: [PrismaModule, CoursesModule, SectionsModule],
  controllers: [LecturesController],
  providers: [LecturesService],
  exports: [LecturesService],
})
export class LecturesModule {}
