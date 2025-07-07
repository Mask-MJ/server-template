import { PartialType } from '@nestjs/swagger';

export class CreateUnitDto {}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
