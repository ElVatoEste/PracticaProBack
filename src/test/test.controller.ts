import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  getTest(): { message: string } {
    return { message: 'El servidor está funcionando correctamente!' };
  }
}
