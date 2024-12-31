import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { OpenAiService } from './openai.service';
import { YoutubeService } from './youtube.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [CourseService, OpenAiService, YoutubeService, PrismaService],
  controllers: [CourseController],
})
export class CourseModule {}
