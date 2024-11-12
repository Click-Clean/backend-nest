import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Setting
  const config = new DocumentBuilder()
    .setTitle('Cloud Project - Nest.js')
    .setDescription('Backend API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser()); // cookie parser for auth

  await app.listen(3000, () => {
    console.log(`Server started on port 3000🚀`);});
}
bootstrap();
