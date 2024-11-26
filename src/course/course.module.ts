import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UnitService } from './unit/unit.service';
import { ChapterService } from './chapter/chapter.service';
import { QuizService } from './quiz/quiz.service';
import { ChatGPTService } from './openai/openai.service';

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
