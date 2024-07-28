import { HttpException, HttpStatus } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let exceptionFilter: HttpExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
    }).compile();

    exceptionFilter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should return default message for Success', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.OK);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.OK,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Solicitação realizada com sucesso',
    });
  });

  it('should return default message for Created', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.CREATED);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CREATED,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Criado com sucesso',
    });
  });

  it('should return default message for ACCEPTED', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.ACCEPTED);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.ACCEPTED,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Requisição aceita',
    });
  });

  it('should return default message for BadRequestException', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.BAD_REQUEST);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Requisição inválida',
    });
  });

  it('should return default message for UnauthorizedException', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.UNAUTHORIZED);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Não autorizado',
    });
  });

  it('should return default message for ForbiddenException', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.FORBIDDEN);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Proibido',
    });
  });

  it('should return default message for NotFoundException', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.NOT_FOUND);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Não encontrado',
    });
  });

  it('should return default message for InternalServerErrorException', () => {
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const exception = new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    exceptionFilter.catch(exception, mockArgumentsHost as any);

    expect(mockArgumentsHost.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockArgumentsHost.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Erro interno do servidor',
    });
  });
});
