import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

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
    systemPrompt: string,
    userPrompt: string,
    outputFormat: Record<string, string>,
  ) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        temperature: this.temperature,
        messages: [
          {
            role: 'system',
            content: `${systemPrompt} Make sure to structure the output using the following JSON format: ${JSON.stringify(outputFormat)}.`,
          },
          { role: 'user', content: userPrompt },
        ],
        response_format: {
          type: 'json_object',
        },
      });

      // todo: fix the return value/type of this function to be more consistent
      const generatedContent = response.choices[0].message?.content ?? '';

      if (generatedContent) {
        const res = JSON.parse(generatedContent);
        return res;
      }

      return generatedContent;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async summarizeTranscript(transcript: string): Promise<string> {
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

      return response.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error summarizing transcript', error.message);
      }
    }
  }
}
