import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ description: 'Nombre de usuario', example: 'Juan Pérez' })
    @IsNotEmpty({ message: 'Debe ingresar algún nombre de usuario' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    nombre: string;

    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@uamv.com' })
    @IsNotEmpty({ message: 'Debe ingresar un correo electrónico' })
    @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
    @Matches(/^[a-zA-Z0-9._%+-]+@uamv/, {
        message: 'El correo electrónico debe ser del dominio @uamv',
    })
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'P4ssword!',
    })
    @IsNotEmpty({ message: 'Debe ingresar una contraseña' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
    })
    password: string;
}
