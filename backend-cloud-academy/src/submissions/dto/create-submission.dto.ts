import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  @IsNotEmpty()
  tarea_id: string;

  @IsUUID()
  @IsNotEmpty()
  estudiante_id: string;

  @IsString()
  @IsNotEmpty()
  google_drive_url: string;
}
