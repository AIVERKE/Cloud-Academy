import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('google_sheets_buffer')
export class GoogleSheetsBuffer {
  @PrimaryColumn()
  fila_id: number;

  @Column({ type: 'timestamp' })
  marca_temporal: Date;

  @Column()
  correo_estudiante: string;

  @Column()
  id_tarea: string;

  @Column()
  url_archivo_drive: string;

  @Column({ type: 'decimal', nullable: true })
  calificacion_ref: number;
}
