import { PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateLoginLogDto {
  @IsString()
  username: string;

  @IsString()
  ip: string;

  @IsString()
  @IsOptional()
  browser: string;

  @IsString()
  @IsOptional()
  os: string;
}

export class QueryLoginLogDto extends PartialType(
  IntersectionType(PickType(CreateLoginLogDto, ['username']), BaseDto),
) {}
