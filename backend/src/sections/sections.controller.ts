import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { PrismaModel } from 'src/_gen/prisma-class';
import { JwtAuth } from 'src/common/decorators/JwtAuth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayLoad } from 'src/common/JwtUserPayLoad';
import { CreateSectionDto } from './dto/CreateSection.dto';
import { UpdateSectionDto } from './dto/UpdateSection.dto';
import { SectionsService } from './sections.service';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  @JwtAuth()
  @ApiOkResponse({
    description: '생성된 섹션',
    type: PrismaModel.Section,
  })
  @ApiParam({
    name: 'courseId',
    description: '강의 ID',
    type: String,
    format: 'uuid',
    example: '6c091a0e-6024-443e-9ce4-19a4fb4dea2d',
  })
  create(
    @Param('courseId', ParseUUIDPipe)
    courseId: string,
    @Body() createSectionDto: CreateSectionDto,
    @User() user: JwtUserPayLoad,
  ) {
    return this.sectionsService.create(courseId, user.id, createSectionDto);
  }

  @Get('sections/:sectionId')
  @ApiOkResponse({
    description: '섹션 조회',
    type: PrismaModel.Section,
  })
  findOne(@Param('sectionId', ParseUUIDPipe) sectionId: string) {
    return this.sectionsService.findById(sectionId);
  }

  @Patch('/sections/:sectionId')
  @JwtAuth()
  @ApiOkResponse({
    description: '섹션 수정',
    type: PrismaModel.Section,
  })
  update(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @User() user: JwtUserPayLoad,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(sectionId, user.id, updateSectionDto);
  }

  @Delete('/sections/:sectionId')
  @JwtAuth()
  @ApiOkResponse({
    description: '섹션 삭제',
    type: PrismaModel.Section,
  })
  delete(@Param('sectionId', ParseUUIDPipe) sectionId: string, @User() user: JwtUserPayLoad) {
    return this.sectionsService.delete(sectionId, user.id);
  }
}
