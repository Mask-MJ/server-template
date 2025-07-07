import { PartialType } from '@nestjs/swagger';

export class CreateValveDto {}
export class UpdateValveDto extends PartialType(CreateValveDto) {}
