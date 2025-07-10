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
import { firstValueFrom } from 'rxjs';
import { transformPdfData } from './analysis-task.helper';
import PDFParser from 'pdf2json';

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
        omit: { result: true },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  async findOne(id: number) {
    return this.prisma.client.analysisTask.findUnique({
      where: { id },
      omit: { result: true },
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

  async upload(id: number, files: Express.Multer.File[]) {
    // 检查储存桶是否存在
    // const bucketName = `factory-${id}`;
    // const bucketExists = await this.minioClient.bucketExists(bucketName);
    // if (!bucketExists) {
    //   await this.minioClient.createBucket(bucketName, 'us-east-1', {});
    // }
    const bucketName = 'pdf';
    const result = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(file.originalname, 'latin1');
        // 加上时间戳，避免文件名重复
        const fileName = `${Date.now()}-${id}-${buffer.toString('utf8')}`;
        await this.minioClient.uploadFile(bucketName, fileName, file.buffer);
        const url = await this.minioClient.getUrl(bucketName, fileName);
        const urlWithoutParams = decodeURIComponent(url.split('?')[0]);
        return urlWithoutParams;
      }),
    ).catch((error) => {
      throw new InternalServerErrorException('文件上传失败', error);
    });
    return result;
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
      await Promise.all(
        analysisTask.files.map(async (fileUrl) => {
          const { data } = await firstValueFrom(
            this.httpService.get(fileUrl, { responseType: 'arraybuffer' }),
          );

          const pdfParser = new PDFParser(this, true);
          pdfParser.on('pdfParser_dataReady', (pdfData) => {
            const texts = pdfData.Pages.reduce((acc: string[], page) => {
              const pageTexts = page.Texts.map((text) =>
                decodeURIComponent(text.R[0].T),
              );
              return [...acc, ...pageTexts];
            }, []);

            transformPdfData(texts);
          });
          pdfParser.on('pdfParser_dataError', (errData) => {
            console.error('PDF解析错误', errData);
          });

          pdfParser.parseBuffer(data);
        }),
      ).catch((error) => {
        throw new InternalServerErrorException('PDF解析失败', error);
      });

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
      console.error('分析任务执行失败', error);
      throw new InternalServerErrorException('分析任务执行失败', error);
    }
  }
}
