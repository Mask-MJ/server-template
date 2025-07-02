import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { CreateMenuDto, QueryMenuDto, UpdateMenuDto } from './menu.dto';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { transformationTree } from '@/common/utils';

@Injectable()
export class MenuService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}
  async create(user: ActiveUserData, createMenuDto: CreateMenuDto) {
    if (createMenuDto.path && createMenuDto.type !== 'B') {
      const suffix = createMenuDto.path
        .replace(/:id$/, '')
        .replace(/^\//, '')
        .replace(/\//g, ':');
      return await this.prisma.client.menu.create({
        data: {
          ...createMenuDto,
          createBy: user.username,
          children: {
            createMany: {
              data: [
                { name: '创建', type: 'B', permission: suffix + ':create' },
                { name: '读取', type: 'B', permission: suffix + ':read' },
                { name: '更新', type: 'B', permission: suffix + ':update' },
                { name: '删除', type: 'B', permission: suffix + ':delete' },
              ],
            },
          },
        },
      });
    } else {
      return await this.prisma.client.menu.create({
        data: { ...createMenuDto, createBy: user.username },
      });
    }
  }

  async findAll(user: ActiveUserData, queryMenuDto: QueryMenuDto) {
    const { name } = queryMenuDto;
    const userData = await this.prisma.client.user.findUnique({
      where: { id: user.sub },
      include: { roles: true },
    });
    if (userData?.isAdmin) {
      const menus = await this.prisma.client.menu.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
      });
      return transformationTree(menus, null);
    } else {
      const roleIds = userData?.roles.map((role) => role.id);
      const menus = await this.prisma.client.menu.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          roles: { some: { id: { in: roleIds } } },
        },
      });
      return transformationTree(menus, null);
    }
  }

  async findOne(id: number) {
    return await this.prisma.client.menu.findUnique({ where: { id } });
  }

  async update(id: number, user: ActiveUserData, updateMenuDto: UpdateMenuDto) {
    return await this.prisma.client.menu.update({
      where: { id },
      data: { ...updateMenuDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.menu.delete({ where: { id } });
  }
}
