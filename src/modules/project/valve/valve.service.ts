import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreateValveDto,
  QueryValveDto,
  QueryValveListDto,
  UpdateValveDto,
} from './valve.dto';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';

@Injectable()
export class ValveService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(user: ActiveUserData, createValveDto: CreateValveDto) {
    return this.prisma.client.valve.create({
      data: { ...createValveDto, createBy: user.username },
    });
  }

  async findAll(queryValveDto: QueryValveDto) {
    const { tag, factoryId, unitId, analysisTaskId, current, pageSize } =
      queryValveDto;
    const [list, meta] = await this.prisma.client.valve
      .paginate({
        where: {
          tag: { contains: tag, mode: 'insensitive' },
          factoryId,
          unitId,
          analysisTask: { some: { id: analysisTaskId } },
        },
        include: { factories: true, unit: true },
        orderBy: { updatedAt: 'desc' },
      })
      .withPages({ page: current, limit: pageSize, includePageCount: true });
    return { list, ...meta };
  }

  async findOne(id: number) {
    return this.prisma.client.valve.findUnique({
      where: { id },
      include: { factories: true, unit: true },
    });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateValveDto: UpdateValveDto,
  ) {
    return this.prisma.client.valve.update({
      where: { id },
      data: { ...updateValveDto, updateBy: user.username },
    });
  }

  async remove(user: ActiveUserData, id: number, ip: string) {
    const valve = await this.prisma.client.valve.delete({
      where: { id },
    });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 位号为${valve.tag}的阀门`,
      businessType: 2,
      module: '阀门管理',
      username: user.username,
      ip,
    });
    return '删除成功';
  }

  async removeAll(user: ActiveUserData, ip: string) {
    await this.prisma.client.valve.deleteMany({});
    this.eventEmitter.emit('delete', {
      title: `删除所有阀门`,
      businessType: 2,
      module: '阀门管理',
      username: user.username,
      ip,
    });
    return '全部删除成功';
  }

  async exportValveList(queryValveDto: QueryValveDto) {
    const { tag, factoryId, unitId, analysisTaskId } = queryValveDto;
    return this.prisma.client.valve.findMany({
      where: {
        tag: { contains: tag, mode: 'insensitive' },
        factoryId,
        unitId,
        analysisTask: { some: { id: analysisTaskId } },
      },
      include: { factories: true, unit: true },
    });
  }

  async findHistoryDataList(queryValveListDto: QueryValveListDto) {
    const { valveId, beginTime, endTime } = queryValveListDto;
    return await this.prisma.client.valveHistoryData.findMany({
      where: { valveId, time: { gte: beginTime, lte: endTime } },
      orderBy: { time: 'desc' },
      include: { valve: true },
    });
  }

  async findHistoryData(id: number) {
    return await this.prisma.client.valveHistoryData.findUnique({
      where: { id },
      include: { valve: true },
    });
  }

  async findScoreList(queryValveListDto: QueryValveListDto) {
    const { valveId, beginTime, endTime } = queryValveListDto;
    const valveHistoryDataList =
      await this.prisma.client.valveHistoryData.findMany({
        where: { valveId, time: { gte: beginTime, lte: endTime } },
        orderBy: { time: 'desc' },
        include: { valve: true },
      });
    // TODO: 计算评分
    return valveHistoryDataList;
  }

  async findScore(id: number) {
    const valveHistoryData =
      await this.prisma.client.valveHistoryData.findUnique({
        where: { id },
        include: { valve: true },
      });

    // TODO: 计算评分
    return valveHistoryData;
  }
}
