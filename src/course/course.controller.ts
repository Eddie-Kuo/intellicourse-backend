import { Controller, Get } from '@nestjs/common';

@Controller('course')
export class CourseController {
  @Get('/')
  sayHello() {
    return 'hello world';
  }
}
