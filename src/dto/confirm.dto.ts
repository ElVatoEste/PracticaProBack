import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmDto {
    @ApiProperty({ description: 'Correo electrónico del usuario' })
    @IsNotEmpty({ message: 'No se esta enviando el correo electrónico' })
    email: string;

    @ApiProperty({ description: 'Código de verificación enviado al correo' })
    @IsNotEmpty({ message: 'Debe ingresar un codigo' })
    code: string;
}
