import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourseOutput, CourseService } from './course.service';
import { GenerateCourseDto } from './dto/generate-course.dto';

@Controller('/api/course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  sayHello() {
    return 'hello world';
  }

  @Post()
  createCourse(
    @Body() generateCourseDto: GenerateCourseDto,
  ): Promise<CourseOutput> {
    return this.courseService.generateCourse(generateCourseDto);
  }

  @Get('/dashboard')
  getCourseList() {
    return this.courseService.getCourseList();
  }

  @Get('/:id')
  getCourseDetailsByCourseId(@Param('id') id: string) {
    return this.courseService.getCourseDetailsByCourseId(id);
  }
}
