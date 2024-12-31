import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({
        message: 'Debe ingresar algun nombre de usuario',
    })
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@uamv/, {
        message: 'El correo electrónico debe ser del dominio @uamv',
    })
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
        message:
            'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
    })
    password: string;
}
