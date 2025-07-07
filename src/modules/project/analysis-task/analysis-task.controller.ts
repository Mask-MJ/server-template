import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnalysisTaskService } from './analysis-task.service';
import {
  CreateAnalysisTaskDto,
  UpdateAnalysisTaskDto,
} from './analysis-task.dto';

@Controller('analysis-task')
export class AnalysisTaskController {
  constructor(private readonly analysisTaskService: AnalysisTaskService) {}

  @Post()
  create(@Body() createAnalysisTaskDto: CreateAnalysisTaskDto) {
    return this.analysisTaskService.create(createAnalysisTaskDto);
  }

  @Get()
  findAll() {
    return this.analysisTaskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analysisTaskService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnalysisTaskDto: UpdateAnalysisTaskDto,
  ) {
    return this.analysisTaskService.update(+id, updateAnalysisTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysisTaskService.remove(+id);
  }
}
