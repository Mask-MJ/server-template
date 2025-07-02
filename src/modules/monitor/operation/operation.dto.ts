import { PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateOperationDto {
  @IsString()
  title: string;

  @IsString()
  username: string;

  @IsNumber()
  businessType: number;

  @IsString()
  module: string;

  @IsString()
  ip: string;
}

export class QueryOperationDto extends PartialType(
  IntersectionType(
    PickType(CreateOperationDto, ['username', 'businessType', 'module']),
    BaseDto,
  ),
) {}
