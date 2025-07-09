import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HostsService } from './hosts.service';
import { ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { SECRET_KEY_HEADER } from 'src/shared/global';
import { HostCreateDto, HostUpdateDto } from './dto';

@Controller('hosts')
@ApiSecurity(SECRET_KEY_HEADER)
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @Get()
  @ApiQuery({ name: 'query', type: String, required: false })
  async findAll(@Query('query') query: string) {
    return this.hostsService.findAll(query);
  }

  @Post()
  async create(@Body() host: HostCreateDto) {
    return this.hostsService.create(host);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.hostsService.delete(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() host: HostUpdateDto) {
    return this.hostsService.update(+id, host);
  }
}
