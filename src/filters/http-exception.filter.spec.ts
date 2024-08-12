import { type ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
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
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.OK);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.OK,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Solicitação realizada com sucesso',
    });
  });

  it('should return default message for Created', () => {
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.CREATED);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CREATED,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Criado com sucesso',
    });
  });

  it('should return default message for ACCEPTED', () => {
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.ACCEPTED);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.ACCEPTED,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Requisição aceita',
    });
  });

  it('should return default message for BadRequestException', () => {
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.BAD_REQUEST);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Requisição inválida',
    });
  });

  it('should return default message for UnauthorizedException', () => {
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.UNAUTHORIZED);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Não autorizado',
    });
  });

  it('should return default message for ForbiddenException', () => {
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.FORBIDDEN);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Proibido',
    });
  });

  it('should return default message for NotFoundException', () => {
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.NOT_FOUND);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Não encontrado',
    });
  });

  it('should return default message for InternalServerErrorException', () => {
    const mockHttpContext = {
      getResponse: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
      getRequest: jest.fn().mockReturnValue({ url: '/test-url' }),
    };

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockHttpContext.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockHttpContext.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Erro interno do servidor',
    });
  });
});
