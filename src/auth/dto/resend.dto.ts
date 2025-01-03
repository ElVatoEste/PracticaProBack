import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendDto {
    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@uamv.com' })
    @IsNotEmpty({ message: 'Debe ingresar un correo electrónico' })
    @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
    email: string;
}
