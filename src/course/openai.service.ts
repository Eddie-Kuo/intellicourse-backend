import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

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
        model: 'gpt-4o',
        temperature: 0.8,
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
}
