import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class GradeSubmissionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  calificacion: number;
}
