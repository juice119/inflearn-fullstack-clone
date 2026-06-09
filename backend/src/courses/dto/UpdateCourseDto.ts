import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './CreateCourseDto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
