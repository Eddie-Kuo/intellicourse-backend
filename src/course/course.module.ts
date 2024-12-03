import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

import { ChatGPTService } from './openai.service';

@Module({
  providers: [CourseService, ChatGPTService],
  controllers: [CourseController],
})
export class CourseModule {}
