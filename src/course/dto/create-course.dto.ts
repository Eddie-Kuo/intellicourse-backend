import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({
    message: 'Field cannot be empty. Enter a topic to learn more about',
  })
  topic: string;
}
