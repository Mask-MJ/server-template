import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { CreateLoginLogDto, QueryLoginLogDto } from './login-log.dto';
import IP2Region from 'ip2region';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LoginLogService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(createloginLogDto: CreateLoginLogDto) {
    const query = new IP2Region();
    const addressInfo = query.search(createloginLogDto.ip);
    const address = addressInfo ? addressInfo.province + addressInfo.city : '';

    return await this.prisma.client.loginLog.create({
      data: { ...createloginLogDto, address },
    });
  }

  async findAll(queryLoginlogDto: QueryLoginLogDto) {
    const { page, pageSize, beginTime, endTime, username } = queryLoginlogDto;
    const [rows, meta] = await this.prisma.client.loginLog
      .paginate({
        where: {
          username: { contains: username },
          createdAt: { gte: beginTime, lte: endTime },
        },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ limit: pageSize, page, includePageCount: true });

    return { rows, ...meta };
  }

  async findOne(id: number) {
    return await this.prisma.client.loginLog.findUniqueOrThrow({
      where: { id },
    });
  }

  @OnEvent(['create', 'login', 'delete'])
  async handleLoginlogEvent(payload: CreateLoginLogDto) {
    await this.create(payload);
  }
}
