import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './user.dto';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { HashingService } from '@/modules/auth/hashing/hashing.service';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  // Exclude keys from user
  // https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields
  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user as Record<string, any>).filter(
        ([key]) => !keys.includes(key as Key),
      ),
    ) as Omit<User, Key>;
  }

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
      include: { roles: { include: { menus: true } } },
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

  async findAll(queryUserDto: QueryUserDto) {
    const {
      username,
      nickname,
      email,
      phoneNumber,
      page,
      pageSize,
      beginTime,
      endTime,
    } = queryUserDto;
    const [rows, meta] = await this.prisma.client.user
      .paginate({
        where: {
          username: { contains: username, mode: 'insensitive' },
          nickname: { contains: nickname, mode: 'insensitive' },
          email: { contains: email, mode: 'insensitive' },
          phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: { roles: true },
      })
      .withPages({ limit: pageSize, page, includePageCount: true });

    return {
      rows: rows.map((user) => this.exclude(user, ['password'])),
      ...meta,
    };
  }

  async findOne(id: number) {
    console.log(UserService.name);

    const user = await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
      include: { roles: true },
    });
    const userWithoutPassword = this.exclude(user, ['password']);
    return userWithoutPassword;
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
