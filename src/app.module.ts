import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { CourseService } from './course/course.service';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [CourseModule, UnitModule],
  controllers: [],
  providers: [AppService, CourseService],
})
export class AppModule {}
