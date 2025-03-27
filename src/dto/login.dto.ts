import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@uamv.com' })
    @IsNotEmpty({ message: 'Debe ingresar un correo electrónico' })
    @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'P4ssword!' })
    @IsNotEmpty({ message: 'Debe ingresar una contraseña' })
    password: string;
}
