import { Inject, Injectable } from '@nestjs/common';
import { CreateDeptDto, QueryDeptDto, UpdateDeptDto } from './document.dto';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { transformationTree } from '@/common/utils';
import { DeptEntity } from './document.entity';
@Injectable()
export class DeptService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(user: ActiveUserData, createDeptDto: CreateDeptDto) {
    const { leaderId } = createDeptDto;
    const userInfo = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: leaderId },
    });
    const dept = await this.prisma.client.dept.create({
      data: {
        ...createDeptDto,
        leader: userInfo.username,
        createBy: user.username,
      },
    });
    await this.prisma.client.user.update({
      where: { id: leaderId },
      data: { isDeptAdmin: true, deptId: dept.id },
    });
    return dept;
  }

  async findAll(queryDeptDto: QueryDeptDto) {
    // https://github.com/prisma/prisma/issues/3725
    // https://github.com/prisma/prisma/issues/4562
    const { name } = queryDeptDto;
    const depts = await this.prisma.client.dept.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
    return transformationTree<DeptEntity>(depts, null);
  }

  async findOne(id: number) {
    return await this.prisma.client.dept.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, user: ActiveUserData, updateDeptDto: UpdateDeptDto) {
    return await this.prisma.client.dept.update({
      where: { id },
      data: { ...updateDeptDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.dept.delete({ where: { id } });
  }
}
