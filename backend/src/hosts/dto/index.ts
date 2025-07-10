import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HostBaseDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNumber()
  port: number;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  alias: string;

  @ApiProperty()
  @IsString()
  username: string;
}

export class HostCreateDto extends HostBaseDto {}

export class HostUpdateDto extends PartialType(HostBaseDto) {}
