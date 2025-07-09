import { Body, Inject, Injectable, UploadedFile } from '@nestjs/common';
import {
  CreateFactoryDto,
  ImportValveDataDto,
  QueryFactoryDto,
  ReportDto,
  UpdateFactoryDto,
} from './factory.dto';
import { MinioService } from '@/common/minio/minio.service';
import { transformationTree } from '@/common/utils';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Valve } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { read, utils } from 'xlsx';

@Injectable()
export class FactoryService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
    private readonly minioClient: MinioService,
  ) {}

  async create(user: ActiveUserData, createFactoryDto: CreateFactoryDto) {
    return this.prisma.client.factory.create({
      data: { ...createFactoryDto, createBy: user.username },
    });
  }

  async findAll(user: ActiveUserData, queryFactoryDto: QueryFactoryDto) {
    const { name, beginTime, endTime, filterId } = queryFactoryDto;
    const userData = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: user.sub },
      include: { roles: true },
    });
    if (userData.isAdmin) {
      const factories = await this.prisma.client.factory.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          NOT: { id: filterId, parentId: filterId },
          createdAt: { gte: beginTime, lte: endTime },
        },
        orderBy: { createdAt: 'desc' },
      });
      return transformationTree(factories, null);
    } else {
      const roleIds = userData.roles.map((role) => role.id);
      const factories = await this.prisma.client.factory.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          NOT: { id: filterId, parentId: filterId },
          createdAt: { gte: beginTime, lte: endTime },
          roles: { some: { id: { in: roleIds } } },
        },
        include: { roles: true },
        orderBy: { createdAt: 'desc' },
      });
      return transformationTree(factories, null);
    }
  }

  async importValveData(
    @ActiveUser() user: ActiveUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportValveDataDto,
  ) {
    const log = { create: 0, update: 0 };
    const { factoryId } = body;
    const workbook = read(file.buffer, { type: 'buffer' });
    const xlsx = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    xlsx.shift();
    const unitNames: string[] = [];
    xlsx.forEach((item: Valve & { unit: string }) => {
      // 获取所有的 装置 名称
      if (item.unit && !unitNames.includes(item.unit)) {
        unitNames.push(item.unit);
      }
    });
    for (const unitName of unitNames) {
      let unit = await this.prisma.client.unit.findFirst({
        where: { name: unitName, factoryId: body.factoryId },
      });
      if (!unit) {
        unit = await this.prisma.client.unit.create({
          data: { name: unitName, factoryId, createBy: user.username },
        });
      }
      xlsx
        .filter((item: Valve & { unit: string }) => item.unit === unitName)
        .forEach(async (item: Valve) => {
          const valve = await this.prisma.client.valve.findFirst({
            where: { tag: item.tag, unitId: unit.id },
          });
          const data: Valve = {
            ...item,
            no: String(item.no),
            since:
              item.since &&
              dayjs((item.since as unknown as string).slice(0, -1)).toDate(),
            serialNumber: String(item.serialNumber),
            valveSize: String(item.valveSize),
            valveRating: String(item.valveRating),
            unitId: unit.id,
            factoryId: body.factoryId,
            updateBy: user.username,
          };
          if (valve) {
            await this.prisma.client.valve.update({
              where: { id: valve.id },
              data,
            });
            // 记录有多少个阀门被更新
            log.update++;
          } else {
            await this.prisma.client.valve.create({ data });
            // 记录有多少个阀门被创建
            log.create++;
          }
        });
    }
    return `导入成功，新增${log.create}个阀门，更新${log.update}个阀门`;
  }

  async findChartData(id: number) {
    const valveBrandGroup = (
      await this.prisma.client.valve.groupBy({
        by: ['valveBrand'],
        _count: true,
        where: { NOT: { valveBrand: '' }, factoryId: id },
      })
    ).map((item) => ({ name: item.valveBrand, value: item._count }));

    const positionerModelGroup = (
      await this.prisma.client.valve.groupBy({
        by: ['positionerModel'],
        _count: true,
        where: { NOT: { positionerModel: '' }, factoryId: id },
      })
    ).map((item) => ({ name: item.positionerModel, value: item._count }));

    return {
      valveBrandGroup,
      positionerModelGroup,
    };
  }

  generateReport(reportData: ReportDto) {
    return reportData;
  }

  async findOne(id: number) {
    return this.prisma.client.factory.findUnique({ where: { id } });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateFactoryDto: UpdateFactoryDto,
  ) {
    return this.prisma.client.factory.update({
      where: { id },
      data: { ...updateFactoryDto, updateBy: user.username },
    });
  }

  async remove(user: ActiveUserData, id: number, ip: string) {
    const factory = await this.prisma.client.factory.delete({
      where: { id },
    });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 名称为${factory.name}的工厂`,
      businessType: 2,
      module: '工厂管理',
      username: user.username,
      ip,
    });
    return '删除成功';
  }

  async removeAll(user: ActiveUserData, ip: string) {
    await this.prisma.client.factory.deleteMany({});
    this.eventEmitter.emit('delete', {
      title: `删除所有工厂`,
      businessType: 2,
      module: '工厂管理',
      username: user.username,
      ip,
    });
    return '全部删除成功';
  }
}
