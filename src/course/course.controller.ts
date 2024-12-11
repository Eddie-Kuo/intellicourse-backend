import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourseOutput, CourseService } from './course.service';
import { GenerateCourseDto } from './dto/generate-course.dto';
import { YoutubeService } from './youtube.service';

@Controller('course')
export class CourseController {
  constructor(
    private courseService: CourseService,
    private youtubeService: YoutubeService,
  ) {}

  @Get()
  sayHello() {
    return 'hello world';
  }

  @Get('/dashboard')
  getCourseList() {
    // Fetch all the courses created by the user
  }

  @Post()
  createCourse(
    @Body() generateCourseDto: GenerateCourseDto,
  ): Promise<CourseOutput> {
    return this.courseService.generateCourse(generateCourseDto);
  }

  // for testing youtube provider
  @Post('/youtube')
  getYoutubeVideoTranscript(@Body() query: string) {
    return this.youtubeService.getYoutubeVideoTranscript('WB6eJmaqxGw');
  }

  // testing
  @Post('/youtube/video')
  getYoutubeVideoId(@Body() query: string) {
    return this.youtubeService.getYoutubeVideoId('how to train a new puppy');
  }
}
