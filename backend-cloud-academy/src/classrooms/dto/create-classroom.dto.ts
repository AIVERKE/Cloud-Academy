import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
