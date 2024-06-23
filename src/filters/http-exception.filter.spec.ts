import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('bad-request')
  badRequest() {
    throw new HttpException('Bad Request Example', HttpStatus.BAD_REQUEST);
  }

  @Get('unauthorized')
  unauthorized() {
    throw new HttpException('Unauthorized Example', HttpStatus.UNAUTHORIZED);
  }

  @Get('forbidden')
  forbidden() {
    throw new HttpException('Forbidden Example', HttpStatus.FORBIDDEN);
  }

  @Get('not-found')
  notFound() {
    throw new HttpException('Not Found Example', HttpStatus.NOT_FOUND);
  }

  @Get('server-error')
  serverError() {
    throw new HttpException('Internal Server Error Example', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
