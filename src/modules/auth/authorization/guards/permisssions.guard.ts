import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { PrismaService } from 'nestjs-prisma';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../auth.constants';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { Menu } from '@prisma/client';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('PrismaService')
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const contextPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!contextPermissions) return true;
    const request = context
      .switchToHttp()
      .getRequest<{ [REQUEST_USER_KEY]: ActiveUserData }>();
    const user: ActiveUserData = request[REQUEST_USER_KEY];
    const userInfo = await this.prisma.client.user.findUnique({
      where: { id: user.sub },
      include: { roles: { include: { menus: { where: { type: 'button' } } } } },
    });

    if (!userInfo) return false;
    if (userInfo.isAdmin) return true;
    const permissionsName = userInfo.roles
      .reduce((acc, role) => acc.concat(role.menus), [] as Menu[])
      .reduce((acc, menu) => acc.concat(menu.permission), [] as string[]);

    return contextPermissions.every((permission) =>
      permissionsName.includes(permission),
    );
  }
}
