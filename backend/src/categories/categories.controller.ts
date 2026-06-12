import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CourseCategory } from '@prisma/client';
import { PrismaModel } from 'src/_gen/prisma-class';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    description: '카테고리 목록',
    type: PrismaModel.CourseCategory,
    isArray: true,
  })
  findAll(): Promise<CourseCategory[]> {
    return this.categoriesService.findAll();
  }
}
