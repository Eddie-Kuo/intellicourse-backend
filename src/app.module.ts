import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { CourseService } from './course/course.service';

@Module({
  imports: [CourseModule],
  controllers: [],
  providers: [AppService, CourseService],
})
export class AppModule {}
