import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import {
  CreateDictDataDto,
  CreateDictDto,
  QueryDictDataDto,
  QueryDictDto,
  UpdateDictDataDto,
  UpdateDictDto,
} from './dict.dto';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';

@Injectable()
export class DictService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(user: ActiveUserData, createDictDto: CreateDictDto) {
    return await this.prisma.client.dict.create({
      data: { ...createDictDto, createBy: user.username },
    });
  }

  async findAll(queryDictDto: QueryDictDto) {
    const { name, value } = queryDictDto;
    return await this.prisma.client.dict.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        value: { contains: value, mode: 'insensitive' },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.client.dict.findUnique({ where: { id } });
  }

  async update(id: number, user: ActiveUserData, updateDictDto: UpdateDictDto) {
    return await this.prisma.client.dict.update({
      where: { id },
      data: { ...updateDictDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.dict.delete({ where: { id } });
  }

  async createData(user: ActiveUserData, createDictDataDto: CreateDictDataDto) {
    return await this.prisma.client.dictData.create({
      data: { ...createDictDataDto, createBy: user.username },
    });
  }

  async findAllData(queryDictDataDto: QueryDictDataDto) {
    const { name, value, dictId } = queryDictDataDto;
    return await this.prisma.client.dictData.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        value: { contains: value, mode: 'insensitive' },
        dictId,
      },
    });
  }

  async findOneData(id: number) {
    return await this.prisma.client.dictData.findUnique({ where: { id } });
  }

  async updateData(
    id: number,
    user: ActiveUserData,
    updateDictDataDto: UpdateDictDataDto,
  ) {
    return await this.prisma.client.dictData.update({
      where: { id },
      data: { ...updateDictDataDto, updateBy: user.username },
    });
  }

  async removeData(id: number) {
    return await this.prisma.client.dictData.delete({ where: { id } });
  }
}
