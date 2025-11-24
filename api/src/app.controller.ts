import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  constructor() {}

  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Skills Matrix API',
    };
  }
}
