import { Injectable } from '@nestjs/common';
import { CourseCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<CourseCategory[]> {
    return this.prisma.courseCategory.findMany();
  }
}
