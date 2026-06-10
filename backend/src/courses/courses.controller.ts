import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuth } from 'src/common/decorators/JwtAuth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayLoad } from 'src/common/JwtUserPayLoad';
import { CreateCourseDto } from './dto/CreateCourseDto';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/UpdateCourseDto';
import { PrismaModel } from 'src/_gen/prisma-class';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @JwtAuth()
  @ApiOkResponse({
    description: '생성된 강의',
    type: PrismaModel.Course,
  })
  create(@User() user: JwtUserPayLoad, @Body() createaCourseDto: CreateCourseDto) {
    return this.coursesService.create(user.id, createaCourseDto);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'caretoryId', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiOkResponse({
    description: '강의 목록',
    type: PrismaModel.Course,
    isArray: true,
  })
  findAll(
    @Query('title') title?: string,
    @Query('level') level?: string,
    @Query('caretoryId') caretoryId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const where: Prisma.CourseWhereInput = {};

    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (caretoryId) {
      where.categories = { some: { id: caretoryId } };
    }

    return this.coursesService.findAll({
      where,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : 30,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get(':id')
  @ApiQuery({
    name: 'include',
    required: false,
    description: 'sections,lectures,courseReviews 등 포함할 관계 지정',
  })
  @ApiOkResponse({
    description: '강의 정보',
    type: PrismaModel.Course,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Query('include') include?: string) {
    const includeArray = include ? include.split(',') : undefined;
    return this.coursesService.findOne(id, includeArray);
  }

  @Patch(':id')
  @JwtAuth()
  @ApiOkResponse({
    description: '강의 제거',
    type: PrismaModel.Course,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: JwtUserPayLoad,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, user.id, updateCourseDto);
  }
}
