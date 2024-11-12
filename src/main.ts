import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  // Swagger Setting
  const config = new DocumentBuilder()
    .setTitle('Cloud Project - Nest.js')
    .setDescription('Backend API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser()); // cookie parser for auth

  const port: number = configService.get<number>('PORT') ?? 3001;

  await app.listen(port, () => {
    console.log(`Server started on port ${port}🚀`);
  });
}
bootstrap();
