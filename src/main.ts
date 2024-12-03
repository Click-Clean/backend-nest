import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './exception/all-exception.filter';
import { AllResponseInterceptor } from './interceptors/all-response.interceptor';
import helmet from 'helmet';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use((req, res, next) => {
    res.removeHeader('Cross-Origin-Opener-Policy');
    next();
  });

  // Swagger Setting
  const config = new DocumentBuilder()
    .setTitle('Cloud Project - Nest.js')
    .setDescription('Backend API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser()); // cookie parser for auth

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.useGlobalInterceptors(new AllResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port: number = configService.get<number>('PORT') ?? 3001;

  await app.listen(port, () => {
    console.log(`Server started on port ${port}🚀`);
  });
}
bootstrap();
