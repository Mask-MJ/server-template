import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import {
  CreateDictTypeDto,
  QueryDictTypeDto,
  UpdateDictTypeDto,
} from './dict-type.dto';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';

@Injectable()
export class DictTypeService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(user: ActiveUserData, createDictTypeDto: CreateDictTypeDto) {
    return await this.prisma.client.dictType.create({
      data: { ...createDictTypeDto, createBy: user.username },
    });
  }

  async findAll(queryDictTypeDto: QueryDictTypeDto) {
    const { name, value, page, pageSize } = queryDictTypeDto;
    const [rows, meta] = await this.prisma.client.dictType
      .paginate({
        where: {
          name: { contains: name, mode: 'insensitive' },
          value: { contains: value, mode: 'insensitive' },
        },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  async findOne(id: number) {
    return await this.prisma.client.dictType.findUnique({ where: { id } });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return await this.prisma.client.dictType.update({
      where: { id },
      data: { ...updateDictTypeDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.dictType.delete({ where: { id } });
  }
}
