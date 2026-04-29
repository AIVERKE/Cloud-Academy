import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  codigo_acceso: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
