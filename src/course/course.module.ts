import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

import { OpenAiService } from './openai.service';

@Module({
  providers: [CourseService, OpenAiService],
  controllers: [CourseController],
})
export class CourseModule {}
