import { Injectable } from '@nestjs/common';

interface Course {
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
  async createCourse(topic: string) {}
}
