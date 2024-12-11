import { IsNotEmpty } from 'class-validator';

export class GenerateCourseDto {
  @IsNotEmpty({
    message: 'Field cannot be empty. Enter a topic to learn more about',
  })
  topic: string;
}
