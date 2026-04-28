import { IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinClassroomDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  codigo_acceso: string;
}
