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
  private courseTopic: string = '';
  constructor(
    private openAiService: OpenAiService,
    private youtubeService: YoutubeService,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<any> {
    const { topic } = createCourseDto;
    this.courseTopic = topic;

    try {
      const generatedCourse: CourseOutput =
        await this.openAiService.generateCourse(topic, {
          title: 'Title of the course',
          units: 'Title of the units',
          chapters:
            'An array of chapters covering the important topics in the unit. Each chapter with a relevant youtube_search_query and a chapter_title key in the JSON object. Be very specific on the material covered in each chapter.',
        });

      await this.processUnits(generatedCourse.units);

      // return the course Id to re route the user to the course once it finishes generating
      return { message: 'Course generation completed' };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async processUnits(units: CourseOutput['units']) {
    const unitPromises = units.map((unit) => this.processUnit(unit));
    await Promise.all(unitPromises);
  }

  async processUnit(unit: CourseOutput['units'][0]) {
    const chapterPromises = unit.chapters.map((chapter) =>
      this.processChapter(chapter),
    );
    await Promise.all(chapterPromises);
  }

  async processChapter(chapter: CourseOutput['units'][0]['chapters'][0]) {
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
    } catch (error) {
      console.error('Error processing chapter', error);
    }
  }
}
