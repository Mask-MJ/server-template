import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { CreateOperationDto, QueryOperationDto } from './operation.dto';
import IP2Region from 'ip2region';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OperationService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(createOperationDto: CreateOperationDto) {
    const query = new IP2Region();
    const addressInfo = query.search(createOperationDto.ip);
    const address = addressInfo ? addressInfo.province + addressInfo.city : '';

    return await this.prisma.client.operationLog.create({
      data: { ...createOperationDto, address },
    });
  }

  async findAll(queryOperationDto: QueryOperationDto) {
    const { page, pageSize, beginTime, endTime, username, businessType } =
      queryOperationDto;
    const [rows, meta] = await this.prisma.client.operationLog
      .paginate({
        where: {
          username: { contains: username },
          businessType,
          createdAt: { gte: beginTime, lte: endTime },
        },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ limit: pageSize, page, includePageCount: true });

    return { rows, ...meta };
  }

  async findOne(id: number) {
    return await this.prisma.client.operationLog.findUniqueOrThrow({
      where: { id },
    });
  }

  @OnEvent(['create', 'login', 'delete'])
  async handleOperationEvent(payload: CreateOperationDto) {
    await this.create(payload);
  }
}
