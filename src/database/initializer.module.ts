import { Module, OnModuleInit } from '@nestjs/common';
import { InitializerService } from './initializer.service';

@Module({
    providers: [InitializerService],
})
export class InitializerModule implements OnModuleInit {
    constructor(private readonly initializerService: InitializerService) {}

    async onModuleInit() {
        await this.initializerService.run();
    }
}
