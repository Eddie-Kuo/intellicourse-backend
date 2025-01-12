import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CourseOutput } from './course.service';

interface GenerateQuestionParams {
  summary: string;
  courseTitle: string;
  outputFormat: Record<string, string>;
}

interface Question {
  question: string;
  options: string[];
  answer: string;
}

@Injectable()
export class OpenAiService {
  private openai: OpenAI;
  private temperature: number = 1;
  private model: string = 'gpt-3.5-turbo';

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCourse(
    topic: string,
    outputFormat: Record<string, string>,
  ): Promise<CourseOutput | null> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        temperature: this.temperature,
        messages: [
          {
            role: 'system',
            content: `You are an experienced instructor on the topic of ${topic}, coming up with relevant unit titles that DO NOT include unit numbers, detailed chapters, and finding relevant youtube videos for each of the chapters. Make sure to structure the output using the following JSON format: ${JSON.stringify(outputFormat)}.`,
          },
          {
            role: 'user',
            content: `It is your job to create a detailed course roadmap about ${topic}. Create units for all the major topics about ${topic}. Then, for each unit, create a list of chapters breaking down the unit into more specific subtopics for the user to follow. Then for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`,
          },
        ],
        response_format: {
          type: 'json_object',
        },
      });

      // todo: fix the return value/type of this function to be more consistent
      const generatedContent = response.choices[0].message?.content ?? '';
      return generatedContent ? JSON.parse(generatedContent) : null;
    } catch (error) {
      console.error('Error generating course:', error);
      throw error;
    }
  }

  async summarizeVideoTranscript(transcript: string): Promise<string> {
    if (!transcript.length) {
      return 'No summary available for this chapter!';
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        temperature: this.temperature,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes a youtube transcript.',
          },
          {
            role: 'user',
            content: `Please summarize the following video transcript in 250 words or less: '${transcript}'. Do not talk about the sponsors or anything unrelated to the main topic of the video or introduce what the summary is about. `,
          },
        ],
      });

      return response.choices[0].message.content ?? 'No summary generated';
    } catch (error) {
      console.error('Error summarizing transcript:', error);
      return 'Error generating summary';
    }
  }

  async generateQuestionsFromSummary({
    summary,
    courseTitle,
    outputFormat,
  }: GenerateQuestionParams): Promise<Question> {
    const emptyQuestion: Question = {
      question: 'No question for this chapter',
      options: [],
      answer: '',
    };

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        temperature: this.temperature,
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI that is able to generate mcq questions and answers based on a given topic. Make sure to structure the output using the following JSON format: ${JSON.stringify(outputFormat)}.`,
          },
          {
            role: 'user',
            content: `You are to generate a random hard mcq question about ${courseTitle} with context of the following transcript: ${summary}. The length of each answer should not be more than 15 words and do not include letter choice options within the options.`,
          },
        ],
      });

      const generatedQuestion = response.choices[0].message?.content;

      return generatedQuestion ? JSON.parse(generatedQuestion) : emptyQuestion;
    } catch (error) {
      console.error('Error generating questions:', error);
      return emptyQuestion;
    }
  }
}
