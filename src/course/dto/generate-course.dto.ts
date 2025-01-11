import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateCourseDto {
  @IsNotEmpty({
    message: 'Field cannot be empty. Enter a topic to learn more about',
  })
  @IsString()
  topic: string;
}
