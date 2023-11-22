import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function start() {
    try {
        const PORT = process.env.PORT || 8000;
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.listen(PORT);
    } catch (e) {
        console.log(e)
    }
}

start();
