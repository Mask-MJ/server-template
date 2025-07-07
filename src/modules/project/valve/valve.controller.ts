import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ValveService } from './valve.service';
import { CreateValveDto, UpdateValveDto } from './valve.dto';

@Controller('valve')
export class ValveController {
  constructor(private readonly valveService: ValveService) {}

  @Post()
  create(@Body() createValveDto: CreateValveDto) {
    return this.valveService.create(createValveDto);
  }

  @Get()
  findAll() {
    return this.valveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.valveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateValveDto: UpdateValveDto) {
    return this.valveService.update(+id, updateValveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valveService.remove(+id);
  }
}
