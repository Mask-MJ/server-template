import { Prisma, PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';
import { Logger } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
// https://github.com/notiz-dev/nestjs-prisma/issues/77
export const extendedPrismaClient = (options?: Prisma.PrismaClientOptions) =>
  new PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >(options)
    .$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }) {
            const start = performance.now();
            const result = await query(args);
            const end = performance.now();
            const time = end - start;
            if (time > 1000) {
              Logger.warn(
                `${model}.${operation}(${JSON.stringify(args)}) => ${time}ms`,
              );
            }
            if (operation === 'delete') {
              Logger.log(
                `${model}.${operation}(${JSON.stringify(args)}) => ${time}ms`,
              );
            }
            return result;
          },
        },
      },
    })
    .$extends(pagination({ pages: { limit: 10, includePageCount: true } }));

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;

export type PrismaService = CustomPrismaService<ExtendedPrismaClient>;
