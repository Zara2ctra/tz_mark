import { Module } from '@nestjs/common';
import { AmoController } from './amo.controller';
import { AmoService } from './amo.service';

@Module({
    controllers: [AmoController],
    providers: [AmoService],
})
export class AmoModule {}