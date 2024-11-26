import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type GeneratedOutput = Record<string, string> | string;

export async function gpt(
  system_prompt: string,
  user_prompt: string,
): Promise<GeneratedOutput> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.8,
      messages: [
        { role: 'system', content: system_prompt },
        { role: 'user', content: user_prompt },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    const generatedContent = response.choices[0].message?.content ?? '';

    if (generatedContent) {
      const res: GeneratedOutput = JSON.parse(generatedContent);
      return res;
    }

    return generatedContent;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
