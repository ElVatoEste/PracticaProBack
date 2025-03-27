import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ description: 'Contraseña actual del usuario' })
    @IsNotEmpty({ message: 'Ingrese la contraseña actual' })
    oldPassword: string;

    @ApiProperty({ description: 'Nueva contraseña del usuario' })
    @IsNotEmpty({ message: 'Ingrese la nueva contraseña' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
    })
    newPassword: string;
}
