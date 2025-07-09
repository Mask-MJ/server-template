import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateAnalysisTaskDto,
  QueryAnalysisTaskDto,
  UpdateAnalysisTaskDto,
} from './analysis-task.dto';
import { MinioService } from '@/common/minio/minio.service';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { PrismaService } from '@/common/datebase/prisma.extension';
import { UploadDto } from '@/common/dto/base.dto';

@Injectable()
export class AnalysisTaskService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
    private readonly minioClient: MinioService,
    @Inject(HttpService) private httpService: HttpService,
  ) {}

  async create(
    user: ActiveUserData,
    createAnalysisTaskDto: CreateAnalysisTaskDto,
    ip: string,
  ) {
    const analysisTask = await this.prisma.client.analysisTask.create({
      data: {
        ...createAnalysisTaskDto,
        createBy: user.username,
      },
    });
    this.eventEmitter.emit('create', {
      title: `创建名称为${analysisTask.name}的分析任务`,
      businessType: 1,
      module: '分析任务',
      username: user.username,
      ip,
    });
    return analysisTask;
  }

  async findAll(queryAnalysisTaskDto: QueryAnalysisTaskDto) {
    const { name, factoryId, page, pageSize } = queryAnalysisTaskDto;
    const [rows, meta] = await this.prisma.client.analysisTask
      .paginate({
        where: { name: { contains: name, mode: 'insensitive' }, factoryId },
        include: { factory: true },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  async findOne(id: number) {
    return this.prisma.client.analysisTask.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    user: ActiveUserData,
    updateAnalysisTaskDto: UpdateAnalysisTaskDto,
  ) {
    return this.prisma.client.analysisTask.update({
      where: { id },
      data: { ...updateAnalysisTaskDto, updateBy: user.username },
    });
  }

  async remove(user: ActiveUserData, id: number, ip: string) {
    const analysisTask = await this.prisma.client.analysisTask.delete({
      where: { id },
    });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 名称为${analysisTask.name}的分析任务`,
      businessType: 2,
      module: '分析任务',
      username: user.username,
      ip,
    });
    return '删除成功';
  }

  async removeAll(user: ActiveUserData, ip: string) {
    await this.prisma.client.analysisTask.deleteMany({});
    this.eventEmitter.emit('delete', {
      title: `删除所有分析任务`,
      businessType: 2,
      module: '分析任务',
      username: user.username,
      ip,
    });
    return '全部删除成功';
  }

  async upload(files: Express.Multer.File[]) {
    // 加上时间戳，避免文件名重复
    const fileName = `${Date.now()}-${files.filename}`;
    await this.minioClient.uploadFile('pdf', fileName, files.buffer);
    const url = await this.minioClient.getUrl('pdf', fileName);
    const urlWithoutParams = url.split('?')[0];
    return { url: urlWithoutParams, name: fileName };
  }

  async result(id: number) {
    const analysisTask =
      await this.prisma.client.analysisTask.findUniqueOrThrow({
        where: { id },
      });
    const result = analysisTask.result;
    if (!result) {
      throw new NotFoundException('分析结果不存在');
    }

    return result;
  }

  async execute(user: ActiveUserData, id: number) {
    try {
      const analysisTask =
        await this.prisma.client.analysisTask.findUniqueOrThrow({
          where: { id },
        });
      await this.prisma.client.analysisTask.update({
        where: { id },
        data: { status: 1 },
      });
      console.log('开始执行分析任务', analysisTask);
      await this.prisma.client.analysisTask.update({
        where: { id },
        data: { status: 2 },
      });
      return '分析任务执行成功';
    } catch (error) {
      await this.prisma.client.analysisTask.update({
        where: { id },
        data: { status: 3 },
      });
      throw new InternalServerErrorException('分析任务执行失败', error);
    }
  }
}
