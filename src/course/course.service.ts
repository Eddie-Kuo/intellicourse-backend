import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { CreateCourseDto } from './dto/create-course.dto';

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

@Injectable()
export class CourseService {
  constructor(private openAiService: OpenAiService) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<CourseOutput> {
    const { topic } = createCourseDto;
    const generatedCourse = await this.openAiService.generateCourse(
      `You are an experienced instructor on the topic of ${topic}, coming up with relevant unit titles, detailed chapters, and finding relevant youtube videos for each of the chapters.`,
      `It is your job to create a detailed course roadmap about ${topic}. Create units for all the major topics about ${topic}. Then, for each unit, create a list of chapters breaking down the unit into more specific subtopics for the user to follow. Then for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`,
      {
        title: 'Title of the course',
        units: 'Title of the units',
        chapters:
          'An array of chapters covering the important topics in the unit. Each chapter with a relevant youtube_search_query and a chapter_title key in the JSON object. Be very specific on the material covered in each chapter.',
      },
    );

    console.log('GeneratedCourse in Service', generatedCourse);
    return;
  }
}
