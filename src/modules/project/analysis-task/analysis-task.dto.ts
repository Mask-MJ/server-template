import { PartialType } from '@nestjs/swagger';
export class CreateAnalysisTaskDto {}
export class UpdateAnalysisTaskDto extends PartialType(CreateAnalysisTaskDto) {}
