import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UnitService } from './unit.service';
import { ChapterService } from './chapter.service';
import { QuizService } from './quiz.service';
import { ChatGPTService } from './openai.service';

@Module({
  providers: [
    CourseService,
    UnitService,
    ChapterService,
    QuizService,
    ChatGPTService,
  ],
  controllers: [CourseController],
})
export class CourseModule {}
