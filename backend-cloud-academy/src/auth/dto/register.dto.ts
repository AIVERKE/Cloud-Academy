import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString()
  nombre_completo: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail({}, { message: 'El formato del email es inválido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número o carácter especial',
  })
  password: string;
}
