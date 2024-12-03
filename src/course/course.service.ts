import { Injectable } from '@nestjs/common';

interface CourseOutput {
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
  async createCourse(topic: string) {
    try {
    } catch (error) {}
  }
}
