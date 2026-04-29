-- ==========================================
-- SEED DATA PARA CLOUD ACADEMY
-- ==========================================

-- 1. ROLES
-- Usamos IDs fijos para referencia fácil en este script
INSERT INTO "roles" ("id", "nombre") VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Root'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Docente'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Estudiante');

-- 2. USUARIOS
-- Nota: La autenticación es vía google_id (OAuth2), no hay password en DB.
INSERT INTO "usuarios" ("id", "google_id", "nombre_completo", "email", "rol_id") VALUES
-- Root
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', '1000000001', 'Admin Sistema', 'admin@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
-- Docentes
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', '1000000002', 'Juan Perez (Docente)', 'jperez@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', '1000000003', 'Maria Lopez (Docente)', 'mlopez@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
-- Estudiantes
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380101', '2000000101', 'Carlos Estudiante 1', 'carlos1@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380102', '2000000102', 'Ana Estudiante 2', 'ana2@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380103', '2000000103', 'Luis Estudiante 3', 'luis3@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380104', '2000000104', 'Elena Estudiante 4', 'elena4@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380105', '2000000105', 'Pedro Estudiante 5', 'pedro5@umsa.bo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');

-- 3. AULAS
INSERT INTO "aulas" ("id", "nombre", "codigo_acceso", "docente_id", "estado") VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Computación en la Nube', 'CLOUD-2024', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', true),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Arquitectura de Software', 'ARCH-2024', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', true),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Base de Datos II', 'DB2-2024', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', true);

-- 4. INSCRIPCIONES (Estudiantes en Aulas)
INSERT INTO "inscripciones" ("estudiante_id", "aula_id") VALUES
-- Aula Cloud
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380101', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380001'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380102', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380001'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380103', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380001'),
-- Aula Arch
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380101', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380002'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380104', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380002'),
-- Aula DB2
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380102', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380003'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380103', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380003'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380105', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380003');

-- 5. TAREAS
INSERT INTO "tareas" ("id", "aula_id", "titulo", "descripcion", "fecha_limite") VALUES
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Laboratorio 1: Docker', 'Crear una imagen de docker para una app node', now() + interval '7 days'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Investigación: Kubernetes', 'Escribir un ensayo sobre orquestación', now() + interval '14 days'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Parcial 1: Consultas SQL', 'Examen práctico de SQL complejo', now() - interval '1 day');

-- 6. ENTREGAS
INSERT INTO "entregas" ("id", "tarea_id", "estudiante_id", "google_drive_file_id", "google_drive_url", "calificacion", "estado", "sync_status") VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380101', 'drive_id_001', 'https://drive.google.com/file/1', 95.50, 'Calificado', 'Sincronizado'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380102', 'drive_id_002', 'https://drive.google.com/file/2', NULL, 'Pendiente', 'Pendiente_Actualizacion'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380105', 'drive_id_003', 'https://drive.google.com/file/3', 80.00, 'Atrasado', 'Sincronizado');

-- 7. LOGS DE AUDITORIA
INSERT INTO "logs_auditoria" ("id", "usuario_id", "accion", "detalle") VALUES
(uuid_generate_v4(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'LOGIN', '{"ip": "192.168.1.1", "device": "Windows/Chrome"}'),
(uuid_generate_v4(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'CREATE_AULA', '{"aula_name": "Computación en la Nube"}'),
(uuid_generate_v4(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380101', 'SUBMIT_ASSIGNMENT', '{"tarea_id": "d1eebc99-9c0b-4ef8-bb6d-6bb9bd380001"}');
