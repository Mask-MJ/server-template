import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { CreateMenuDto, QueryMenuDto, UpdateMenuDto } from './menu.dto';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';

@Injectable()
export class MenuService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    if (createMenuDto.path && createMenuDto.type !== 'button') {
      const suffix = createMenuDto.path
        .replace(/:id$/, '')
        .replace(/^\//, '')
        .replace(/\//g, ':');
      return await this.prisma.client.menu.create({
        data: {
          ...createMenuDto,
          children: {
            createMany: {
              data: [
                {
                  name: '创建',
                  type: 'button',
                  permission: suffix + ':create',
                },
                { name: '读取', type: 'button', permission: suffix + ':read' },
                {
                  name: '更新',
                  type: 'button',
                  permission: suffix + ':update',
                },
                {
                  name: '删除',
                  type: 'button',
                  permission: suffix + ':delete',
                },
              ],
            },
          },
        },
      });
    } else {
      return await this.prisma.client.menu.create({
        data: { ...createMenuDto },
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
      return await this.prisma.client.menu.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
      });
    } else {
      const roleIds = userData?.roles.map((role) => role.id);
      return await this.prisma.client.menu.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          roles: { some: { id: { in: roleIds } } },
        },
      });
    }
  }

  async findOne(id: number) {
    return await this.prisma.client.menu.findUnique({ where: { id } });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    return await this.prisma.client.menu.update({
      where: { id },
      data: { ...updateMenuDto },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.menu.delete({ where: { id } });
  }
}
