import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { CourseService } from './course/course.service';
import { OpenAiService } from './course/openai.service';
import { YoutubeService } from './course/youtube.service';
import { PrismaService } from './course/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CourseModule,
  ],
  controllers: [],
  providers: [CourseService, OpenAiService, YoutubeService, PrismaService],
})
export class AppModule {}
