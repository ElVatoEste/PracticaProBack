import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) {}

  async createUser(data: {
    nombre: string;
    email: string;
    password: string;
  }): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = this.usuarioRepository.create({
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
    });
    return this.usuarioRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { email } });
  }
}
