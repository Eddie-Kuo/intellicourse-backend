import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { CourseService } from './course/course.service';
import { OpenAiService } from './course/openai.service';
import { YoutubeService } from './course/youtube.service';
import { PrismaService } from './course/prisma.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CourseModule,
    process.env.APP_ENV == 'development'
      ? LoggerModule.forRoot({
          pinoHttp: {
            transport: {
              // formats logs to be more readable
              target: 'pino-pretty',
              options: {
                // allows logs to span multiple lines for better readability
                singleLine: false,
              },
            },
            serializers: {
              // only include id, method, and url from requests
              req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
              }),
            },
          },
        })
      : LoggerModule.forRoot(),
  ],
  controllers: [],
  providers: [CourseService, OpenAiService, YoutubeService, PrismaService],
})
export class AppModule {}
