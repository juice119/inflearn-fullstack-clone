import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuth } from 'src/common/decorators/JwtAuth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayLoad } from 'src/common/JwtUserPayLoad';
import { CreateCourseDto } from './dto/CreateCourseDto';
import { ApiQuery } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guards';
import { UpdateCourseDto } from './dto/UpdateCourseDto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @JwtAuth()
  create(
    @User() user: JwtUserPayLoad,
    @Body() createaCourseDto: CreateCourseDto,
  ) {
    return this.coursesService.create(user.id, createaCourseDto);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'caretoryId', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
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
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string,
  ) {
    const includeArray = include ? include.split(',') : undefined;
    return this.coursesService.findOne(id, includeArray);
  }

  @Patch(':id')
  @JwtAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: JwtUserPayLoad,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, user.id, updateCourseDto);
  }
}
