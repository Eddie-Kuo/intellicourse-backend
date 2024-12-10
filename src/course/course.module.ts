import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { OpenAiService } from './openai.service';
import { YoutubeService } from './youtube.service';

@Module({
  providers: [CourseService, OpenAiService, YoutubeService],
  controllers: [CourseController],
})
export class CourseModule {}
