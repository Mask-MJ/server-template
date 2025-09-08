import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async create(user: ActiveUserData, createPostDto: CreatePostDto) {
    return await this.prisma.client.post.create({
      data: { ...createPostDto, createBy: user.username },
    });
  }

  async findAll(queryPostDto: QueryPostDto) {
    const { name, code, current, pageSize } = queryPostDto;
    const [list, meta] = await this.prisma.client.post
      .paginate({
        where: {
          name: { contains: name, mode: 'insensitive' },
          code: { contains: code, mode: 'insensitive' },
        },
        orderBy: { order: 'asc' },
      })
      .withPages({ page: current, limit: pageSize, includePageCount: true });
    return { list, ...meta };
  }

  async findOne(id: number) {
    return await this.prisma.client.post.findUnique({ where: { id } });
  }

  async update(id: number, user: ActiveUserData, updatePostDto: UpdatePostDto) {
    return await this.prisma.client.post.update({
      where: { id },
      data: { ...updatePostDto, updateBy: user.username },
    });
  }

  async remove(id: number) {
    return await this.prisma.client.post.delete({ where: { id } });
  }
}
