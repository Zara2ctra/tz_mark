import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {AmoModule} from "./amo/amo.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      AmoModule
  ],
})
export class AppModule {}
