import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { GenerateCourseDto } from './dto/generate-course.dto';
import { YoutubeService } from './youtube.service';
import { PrismaService } from './prisma.service';

export interface CourseOutput {
  title: string;
  units: {
    title: string;
    chapters: {
      chapter_title: string;
      youtube_search_query: string;
    }[];
  }[];
}

export interface Question {
  question: string;
  answer: string;
  options: string[];
}

@Injectable()
export class CourseService {
  private courseTopic: string = '';
  private readonly logger = new Logger(CourseService.name);
  constructor(
    private openAiService: OpenAiService,
    private youtubeService: YoutubeService,
    private prismaService: PrismaService,
  ) {}

  async generateCourse(generateCourseDto: GenerateCourseDto): Promise<any> {
    const { topic } = generateCourseDto;
    this.courseTopic = topic;

    try {
      const generatedCourse: CourseOutput =
        await this.openAiService.generateCourse(topic, {
          title: 'Title of the course',
          units: 'Title of the unit. Do not include unit numbers in the title',
          chapters:
            'An array of chapters covering the important topics in the unit. Each chapter with a relevant youtube_search_query and a chapter_title key in the JSON object. Be very specific on the material covered in each chapter.',
        });

      const course = await this.prismaService.course.create({
        data: {
          title: generatedCourse.title,
        },
      });

      await this.processUnits(generatedCourse.units, course.id);
      return { courseId: course.id };
    } catch (error) {
      this.logger.log({ error: error.message }, 'Error generating course.');
    }
  }

  async processUnits(units: CourseOutput['units'], courseId: string) {
    const unitPromises = units.map((unit, unitIndex) =>
      this.processUnit(unit, courseId, unitIndex),
    );
    await Promise.all(unitPromises);
  }

  async processUnit(
    unit: CourseOutput['units'][0],
    courseId: string,
    unitIndex: number,
  ) {
    const addedUnit = await this.prismaService.unit.create({
      data: {
        title: unit.title,
        courseId,
        unitNumber: unitIndex + 1,
      },
    });

    const chapterPromises = unit.chapters.map((chapter, chapterIndex) =>
      this.processChapter(chapter, addedUnit.id, chapterIndex),
    );
    await Promise.all(chapterPromises);
  }

  async processChapter(
    chapter: CourseOutput['units'][0]['chapters'][0],
    unitId: string,
    chapterIndex: number,
  ) {
    try {
      const videoId = await this.youtubeService.getYoutubeVideoId(
        chapter.youtube_search_query,
      );

      if (!videoId) {
        return;
      }

      const transcript =
        await this.youtubeService.getYoutubeVideoTranscript(videoId);

      if (!transcript.length) {
        return;
      }

      const summary =
        await this.openAiService.summarizeVideoTranscript(transcript);

      const questions: Question =
        await this.openAiService.generateQuestionsFromSummary({
          courseTitle: this.courseTopic,
          summary,
          outputFormat: {
            question: 'The question',
            options:
              'an array of four answer choices to the question with one of them being the correct answer',
            answer: 'the answer to the question',
          },
        });

      const addedChapter = await this.prismaService.chapter.create({
        data: {
          unitId,
          title: chapter.chapter_title,
          videoId,
          youtubeSearchQuery: chapter.youtube_search_query,
          summary,
          chapterNumber: chapterIndex + 1,
        },
      });

      await this.prismaService.question.create({
        data: {
          chapterId: addedChapter.id,
          question: questions.question,
          answer: questions.answer,
          options: JSON.stringify(
            questions.options.sort(() => Math.random() - 0.5), // shuffle the options before adding them into database
          ),
        },
      });
    } catch (error) {
      this.logger.log({ error }, 'Error processing chapter');
    }
  }

  async getCourseList() {
    return await this.prismaService.course.findMany();
  }

  async getCourseDetailsByCourseId(id: string) {
    return await this.prismaService.course.findUnique({
      where: {
        id,
      },
      include: {
        units: {
          orderBy: { unitNumber: 'asc' },
          include: {
            chapters: {
              orderBy: { chapterNumber: 'asc' },
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });
  }
}
