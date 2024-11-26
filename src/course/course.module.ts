import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UnitService } from './chapter/unit.service';
import { ChapterService } from './chapter/chapter.service';
import { QuizService } from './quiz/quiz.service';

@Module({
  providers: [CourseService, UnitService, ChapterService, QuizService],
  controllers: [CourseController],
})
export class CourseModule {}
