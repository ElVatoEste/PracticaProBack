import { ApiProperty } from '@nestjs/swagger';

export class ConfirmDto {
    @ApiProperty({ description: 'Correo electrónico del usuario' })
    email: string;

    @ApiProperty({ description: 'Código de verificación enviado al correo' })
    code: string;
}
