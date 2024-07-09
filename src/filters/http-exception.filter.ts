import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message = exception.message;

    switch (status) {
      case HttpStatus.OK:
        message = 'Solicitação realizada com sucesso';
        break;
      case HttpStatus.CREATED:
        message = 'Criado com sucesso';
        break;
      case HttpStatus.ACCEPTED:
        message = 'Requisição aceita';
        break;
      case HttpStatus.BAD_REQUEST:
        message = 'Requisição inválida';
        break;
      case HttpStatus.UNAUTHORIZED:
        message = 'Não autorizado';
        break;
      case HttpStatus.FORBIDDEN:
        message = 'Proibido';
        break;
      case HttpStatus.NOT_FOUND:
        message = 'Não encontrado';
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        message = 'Erro interno do servidor';
        break;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
