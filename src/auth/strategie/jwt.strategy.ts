import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
        });
    }

    /**
     * Payload es el contenido del token JWT.
     * Retornamos un objeto que estará disponible en req.user
     */
    async validate(payload: any) {
        return {
            userId: payload.sub, // sub = ID de usuario
            username: payload.username,
        };
    }
}
