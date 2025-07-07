import { Injectable } from '@nestjs/common';
import { CreateValveDto, UpdateValveDto } from './valve.dto';

@Injectable()
export class ValveService {
  create(createValveDto: CreateValveDto) {
    return 'This action adds a new valve';
  }

  findAll() {
    return `This action returns all valve`;
  }

  findOne(id: number) {
    return `This action returns a #${id} valve`;
  }

  update(id: number, updateValveDto: UpdateValveDto) {
    return `This action updates a #${id} valve`;
  }

  remove(id: number) {
    return `This action removes a #${id} valve`;
  }
}
