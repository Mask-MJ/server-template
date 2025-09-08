import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginateDto } from '../dto/base.dto';

class PaginateResponse<TData> extends PaginateDto {
  total: number;
  list: TData[];
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginateResponse, model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginateResponse) },
          {
            properties: {
              total: {
                type: 'number',
                default: 0,
              },
              list: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
                default: [],
              },
            },
          },
        ],
      },
    }),
  );
};
