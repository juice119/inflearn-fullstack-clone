import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/JwtAuth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayLoad } from 'src/common/JwtUserPayLoad';
import { CreateLectureDto } from './dto/CreateLecture.dto';
import { UpdateLectureDto } from './dto/UpdateLecture.dto';
import { LecturesService } from './lectures.service';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post('/courses/:courseId/sections/:sectionId/lectures')
  @JwtAuth()
  @ApiParam({
    name: 'courseId',
    description: '강의 ID',
    type: 'string',
    format: 'uuid',
    example: '6c091a0e-6024-443e-9ce4-19a4fb4dea2d',
  })
  @ApiParam({
    name: 'sectionId',
    description: '섹션 ID',
    type: 'string',
    format: 'uuid',
    example: '6c091a0e-6024-443e-9ce4-19a4fb4dea2d',
  })
  create(
    @Param('courseId', ParseUUIDPipe)
    courseId: string,
    @Param('sectionId', ParseUUIDPipe)
    sectionId: string,
    @Body() createLectureDto: CreateLectureDto,
    @User() user: JwtUserPayLoad,
  ) {
    return this.lecturesService.create(courseId, sectionId, user.id, createLectureDto);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    description: '유닛 ID',
    type: 'string',
    format: 'uuid',
    example: '6c091a0e-6024-443e-9ce4-19a4fb4dea2d',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lecturesService.findValidated(id);
  }

  @Patch('/:id')
  @JwtAuth()
  @ApiParam({
    name: 'id',
    description: '유닛 ID',
    type: 'string',
    format: 'uuid',
    example: '6c091a0e-6024-443e-9ce4-19a4fb4dea2d',
  })
  update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateLectureDto: UpdateLectureDto,
    @User() user: JwtUserPayLoad,
  ) {
    return this.lecturesService.update(id, user.id, updateLectureDto);
  }

  @Delete('/:id')
  @JwtAuth()
  @ApiParam({
    name: 'id',
    description: '유닛 ID',
    type: 'string',
    format: 'uuid',
    example: '6c091a0e-6024-443e-9ce4-19a4fb4dea2d',
  })
  delete(@Param('id', ParseUUIDPipe) id: string, @User() user: JwtUserPayLoad) {
    return this.lecturesService.delete(id, user.id);
  }
}
