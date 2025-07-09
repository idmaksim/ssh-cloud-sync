import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  @Public()
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }

  // @ApiSecurity(SECRET_KEY_HEADER)
}
