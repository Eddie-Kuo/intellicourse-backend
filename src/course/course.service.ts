import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { YoutubeService } from './youtube.service';

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
  constructor(
    private openAiService: OpenAiService,
    private youtubeService: YoutubeService,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<any> {
    const { topic } = createCourseDto;

    const generatedCourse: CourseOutput =
      await this.openAiService.generateCourse(topic, {
        title: 'Title of the course',
        units: 'Title of the units',
        chapters:
          'An array of chapters covering the important topics in the unit. Each chapter with a relevant youtube_search_query and a chapter_title key in the JSON object. Be very specific on the material covered in each chapter.',
      });

    await Promise.all(
      generatedCourse.units.map(async (unit) => {
        await Promise.all(
          unit.chapters.map(async (chapter) => {
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
                courseTitle: generatedCourse.title,
                summary,
                outputFormat: {
                  question: 'The question',
                  options:
                    'an array of four answer choices to the question with one of them being the correct answer',
                  answer: 'the answer to the question',
                },
              });
            console.log(
              '🚀 ~ CourseService ~ unit.chapters.map ~ questions:',
              questions,
            );

            //Todo next: input all the generated data into a database
          }),
        );
      }),
    );

    // return the course Id to re route the user to the course once it finishes generating
    return { courseId: 1 };
  }
}
