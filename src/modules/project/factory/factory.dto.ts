import { PartialType } from '@nestjs/swagger';

export class CreateFactoryDto {}
export class UpdateFactoryDto extends PartialType(CreateFactoryDto) {}
