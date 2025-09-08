import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import {
  CreateDictDataDto,
  QueryDictDataDto,
  UpdateDictDataDto,
} from './dict-data.dto';

@Injectable()
export class DictDataService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(user: ActiveUserData, createDictDataDto: CreateDictDataDto) {
    return await this.prisma.client.dictData.create({
      data: { ...createDictDataDto, createBy: user.username },
    });
  }

  async findAll(queryDictDataDto: QueryDictDataDto) {
    const { name, value, dictTypeId, current, pageSize } = queryDictDataDto;
    const [list, meta] = await this.prisma.client.dictData
      .paginate({
        where: {
          name: { contains: name },
          value: { contains: value },
          dictTypeId: dictTypeId,
        },
        orderBy: { order: 'asc' },
      })
      .withPages({ page: current, limit: pageSize, includePageCount: true });
    return { list, ...meta };
  }

  async findOne(id: number) {
    return await this.prisma.client.dictData.findUnique({ where: { id } });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateDictDataDto: UpdateDictDataDto,
  ) {
    return await this.prisma.client.dictData.update({
      where: { id },
      data: { ...updateDictDataDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.dictData.delete({ where: { id } });
  }
}
