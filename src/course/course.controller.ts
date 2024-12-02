import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  sayHello() {
    return 'hello world';
  }

  @Get('/dashboard')
  getCourseList() {
    // Fetch all the courses created by the user
  }

  @Post()
  createCourse(@Body() topic: string) {
    // Create a course based on the inputted topic
    return this.courseService.createCourse(topic);
  }
}
