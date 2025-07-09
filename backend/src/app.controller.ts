import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SECRET_KEY_HEADER } from './shared/global';

@Controller()
@ApiTags('App')
export class AppController {
  @Public()
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }

  @ApiSecurity(SECRET_KEY_HEADER)
  @Get('test')
  test(): string {
    return 'Test';
  }
}
