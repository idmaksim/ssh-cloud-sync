import { ApiProperty } from '@nestjs/swagger';
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
}

export class HostCreateDto extends HostBaseDto {}
