import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(
    exception: HttpException | Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { headers, query, params } = ctx.getRequest<Request>();
    let message: unknown = exception['response'] || 'Internal Server Error';
    if (exception.name === 'PrismaClientKnownRequestError') {
      const shortMessage = exception.message.substring(
        exception.message.indexOf('→'),
      );
      message =
        `[${(exception as Prisma.PrismaClientKnownRequestError).code}]: ` +
        shortMessage.substring(shortMessage.indexOf('\n')).trim();
    }
    if (exception.name === 'PrismaClientValidationError') {
      message = exception.message.split('\n\n')[2];
    }
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: any = {
      headers,
      query,
      params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(ctx.getRequest()),
      exception: exception['name'],
      error: message,
    };

    this.logger.error('[Exception Filter] Error:', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
