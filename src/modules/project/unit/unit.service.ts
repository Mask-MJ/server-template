import { Inject, Injectable } from '@nestjs/common';
import { CreateUnitDto, QueryUnitDto, UpdateUnitDto } from './unit.dto';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/common/datebase/prisma.extension';

@Injectable()
export class UnitService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(user: ActiveUserData, createUnitDto: CreateUnitDto) {
    return this.prisma.client.unit.create({
      data: { ...createUnitDto, createBy: user.username },
    });
  }

  async findAll(queryUnitDto: QueryUnitDto) {
    const { name, factoryId, page, pageSize } = queryUnitDto;
    const [rows, meta] = await this.prisma.client.unit
      .paginate({
        where: { name: { contains: name }, factoryId: factoryId },
        include: { factories: true },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  async findOne(id: number) {
    return this.prisma.client.unit.findUnique({ where: { id } });
  }

  async update(id: number, user: ActiveUserData, updateUnitDto: UpdateUnitDto) {
    return this.prisma.client.unit.update({
      where: { id },
      data: { ...updateUnitDto, updateBy: user.username },
    });
  }

  async remove(user: ActiveUserData, id: number, ip: string) {
    const unit = await this.prisma.client.unit.delete({ where: { id } });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 名称为${unit.name}的工厂`,
      businessType: 2,
      module: '工厂管理',
      username: user.username,
      ip,
    });
    return '删除成功';
  }

  async removeAll(user: ActiveUserData, ip: string) {
    await this.prisma.client.unit.deleteMany({});
    this.eventEmitter.emit('delete', {
      title: `删除所有装置`,
      businessType: 2,
      module: '装置管理',
      username: user.username,
      ip,
    });
    return '全部删除成功';
  }
}
