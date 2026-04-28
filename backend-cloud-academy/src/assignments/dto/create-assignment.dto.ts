import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsDateString()
  fecha_limite: string;
}
