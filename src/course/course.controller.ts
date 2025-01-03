import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourseOutput, CourseService } from './course.service';
import { GenerateCourseDto } from './dto/generate-course.dto';

@Controller('/api/v1/course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  createCourse(
    @Body() generateCourseDto: GenerateCourseDto,
  ): Promise<CourseOutput> {
    return this.courseService.generateCourse(generateCourseDto);
  }

  @Get()
  getCourseList() {
    return this.courseService.getCourseList();
  }

  @Get('/:id')
  getCourseDetailsByCourseId(@Param('id') id: string) {
    return this.courseService.getCourseDetailsByCourseId(id);
  }
}
