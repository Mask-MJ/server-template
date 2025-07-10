import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  private endPoint: string;
  private port: number;
  constructor(private configService: ConfigService) {
    this.endPoint = this.configService.get<string>('MINIO_ENDPOINT', '');
    this.port = Number(this.configService.get<string>('MINIO_PORT'));
    this.minioClient = new Minio.Client({
      endPoint: this.endPoint,
      port: this.port,
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });
  }
  // 创建储存桶
  async createBucket(
    bucketName: string,
    region: string = 'us-east-1',
    makeOpts,
  ) {
    return await this.minioClient.makeBucket(bucketName, region, makeOpts);
  }
  // 检查储存桶是否存在
  async bucketExists(bucketName: string) {
    return await this.minioClient.bucketExists(bucketName);
  }
  // 上传文件
  async uploadFile(bucketName: string, objectName: string, data: Buffer) {
    await this.minioClient.putObject(bucketName, objectName, data);
  }
  // 获取文件的URL
  getUrl(bucketName: string, objectName: string) {
    return this.minioClient.presignedGetObject(bucketName, objectName);
  }
}
