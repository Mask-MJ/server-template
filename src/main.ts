import helmet from 'helmet';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from 'src/common/filters/all-exception.filter';
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mw } from 'request-ip';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  // 获取配置
  const NAME = configService.get<string>('APP_NAME');
  const PORT = configService.get<number>('PORT', 3000);
  const PREFIX = configService.get<string>('PREFIX', 'api');
  const CORS = configService.get<boolean>('CORS', false);
  const VERSION = configService.get<string>('VERSION');
  // let defaultVersion: string[] = [VERSION];
  // if (VERSION.indexOf(',')) {
  //   defaultVersion = VERSION.split(',');
  //   app.enableVersioning({
  //     type: VersioningType.URI,
  //     defaultVersion,
  //   });
  // }
  const defaultVersion = VERSION ? VERSION.split(',') : VERSION_NEUTRAL;
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion,
  });
  // 访问前缀
  app.setGlobalPrefix(PREFIX);
  // 全局拦截器
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
  // 跨域
  if (CORS) {
    app.enableCors();
  }
  // 版本
  if (VERSION) {
    app.enableVersioning({ type: VersioningType.URI, defaultVersion });
  }
  // 安全处理
  app.use(helmet());
  const swaggerOptions = new DocumentBuilder()
    .setTitle(`${NAME} 接口文档`)
    .setDescription(`The ${NAME} API escription`)
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'bearer',
      description: '基于 JWT token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  // 项目依赖当前文档功能，最好不要改变当前地址
  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup(`doc`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: `${NAME} API Docs`,
  });
  // 获取真实 ip
  app.use(mw({ attributeName: 'ip' }));
  await app.listen(PORT);
  console.log(
    `服务启动成功 `,
    '\n',
    '服务地址',
    `http://localhost:${PORT}/${PREFIX}/`,
    '\n',
    '文档地址',
    `http://localhost:${PORT}/doc/`,
  );
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
