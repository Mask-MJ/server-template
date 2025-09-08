import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import {
  CreateOperationLogDto,
  QueryOperationLogDto,
} from './operation-log.dto';
import IP2Region from 'ip2region';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OperationLogService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(createOperationLogDto: CreateOperationLogDto) {
    const query = new IP2Region();
    const addressInfo = query.search(createOperationLogDto.ip);
    const address = addressInfo ? addressInfo.province + addressInfo.city : '';

    return await this.prisma.client.operationLog.create({
      data: { ...createOperationLogDto, address },
    });
  }

  async findAll(queryOperationLogDto: QueryOperationLogDto) {
    const { current, pageSize, beginTime, endTime, username, businessType } =
      queryOperationLogDto;
    const [list, meta] = await this.prisma.client.operationLog
      .paginate({
        where: {
          username: { contains: username },
          businessType,
          createdAt: { gte: beginTime, lte: endTime },
        },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ limit: pageSize, page: current, includePageCount: true });

    return { list, ...meta };
  }

  async findOne(id: number) {
    return await this.prisma.client.operationLog.findUniqueOrThrow({
      where: { id },
    });
  }

  @OnEvent(['create', 'login', 'delete'])
  async handleOperationEvent(payload: CreateOperationLogDto) {
    await this.create(payload);
  }
}
