import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: AbstractHttpAdapter<any, any, any>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): any {
    const httpAdapterHost = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
          };

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      success: false,
      status: httpStatus,
      data: exceptionResponse,
    };

    httpAdapterHost.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
