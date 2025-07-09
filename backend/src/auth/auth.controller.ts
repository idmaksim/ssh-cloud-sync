import { Controller, Get } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { SECRET_KEY_HEADER } from 'src/shared/global';

@Controller('auth')
@ApiSecurity(SECRET_KEY_HEADER)
export class AuthController {
  @Get('verify')
  async verify(): Promise<string> {
    return 'OK';
  }
}
