import { IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinClassroomDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 10, { message: 'El código de acceso debe tener entre 4 y 10 caracteres' })
  codigo_acceso: string;
}
