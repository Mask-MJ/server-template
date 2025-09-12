import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './user.dto';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { HashingService } from '@/modules/auth/hashing/hashing.service';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private configService: ConfigService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
    @Inject(HttpService) private httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.client.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException('账号已存在');
    }
    const { roleIds, ...rest } = createUserDto;

    return this.prisma.client.user.create({
      data: {
        ...rest,
        password: await this.hashingService.hash(createUserDto.password),
        roles: { connect: roleIds?.map((id) => ({ id })) },
      },
    });
  }

  async findSelf(id: number) {
    return await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
      omit: { password: true },
      include: {
        roles: { include: { menus: true } },
        dept: { select: { id: true, name: true } },
      },
    });
  }

  async findSelfCode(id: number) {
    const userInfo = await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
      include: { roles: { include: { menus: true } } },
    });
    const codes = userInfo.roles.flatMap((role) =>
      role.menus.map((menu) => menu.permission),
    );
    return Array.from(new Set(codes));
  }

  async findWithPagination(queryUserDto: QueryUserDto) {
    const {
      username,
      nickname,
      email,
      phoneNumber,
      current,
      pageSize,
      beginTime,
      endTime,
    } = queryUserDto;
    const [list, meta] = await this.prisma.client.user
      .paginate({
        where: {
          username: { contains: username, mode: 'insensitive' },
          nickname: { contains: nickname, mode: 'insensitive' },
          email: { contains: email, mode: 'insensitive' },
          phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: {
          roles: { select: { id: true, name: true } },
          dept: { select: { id: true, name: true } },
        },
        omit: { password: true },
      })
      .withPages({ limit: pageSize, page: current, includePageCount: true });

    return { list, ...meta };
  }

  async findAll(queryUserDto: QueryUserDto) {
    const { username, nickname, email, phoneNumber, beginTime, endTime } =
      queryUserDto;
    return await this.prisma.client.user.findMany({
      where: {
        username: { contains: username, mode: 'insensitive' },
        nickname: { contains: nickname, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' },
        phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
        createdAt: { gte: beginTime, lte: endTime },
      },
      include: {
        roles: { select: { id: true, name: true } },
        dept: { select: { id: true, name: true } },
      },
      omit: { password: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
      include: { roles: true, dept: true },
      omit: { password: true },
    });
  }

  async changePassword(id: number, password: string, oldPassword: string) {
    const user = await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
    });
    // 判断是否是管理员权限 如果是管理员权限则不需要验证原密码
    if (user.isAdmin) {
      return this.prisma.client.user.update({
        where: { id },
        data: { password: await this.hashingService.hash(password) },
      });
    }
    const isPasswordValid = await this.hashingService.compare(
      oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ConflictException('原密码错误');
    }
    const newPassword = await this.hashingService.hash(password);
    return this.prisma.client.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roleIds, ...rest } = updateUserDto;
    return await this.prisma.client.user.update({
      where: { id },
      data: { ...rest, roles: { connect: roleIds?.map((id) => ({ id })) } },
    });
  }

  async remove(user: ActiveUserData, id: number, ip: string) {
    // 判断是否是管理员账号, 如果是管理员账号则不允许删除
    const userInfo = await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
    });
    if (userInfo.isAdmin) {
      throw new ConflictException('管理员账号不允许删除');
    }
    await this.prisma.client.user.delete({ where: { id } });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 账号为${userInfo.username}的用户`,
      businessType: 2,
      module: '用户管理',
      username: user.username,
      ip,
    });
    return '删除成功';
  }
}
