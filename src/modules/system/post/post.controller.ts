import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from './post.dto';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { PostEntity } from './post.entity';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';

@ApiTags('岗位管理')
@ApiBearerAuth('bearer')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 创建岗位
   */
  @Post()
  @ApiCreatedResponse({ type: PostEntity })
  @Permissions('system:post:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(user, createPostDto);
  }

  /**
   * 获取岗位列表
   */
  @Get()
  @ApiPaginatedResponse(PostEntity)
  @Permissions('system:post:query')
  findAll(@Query() queryPostDto: QueryPostDto) {
    return this.postService.findAll(queryPostDto);
  }

  /**
   * 获取岗位详情
   */
  @Get(':id')
  @ApiOkResponse({ type: PostEntity })
  @Permissions('system:post:query')
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  /**
   * 更新岗位
   */
  @Patch(':id')
  @ApiOkResponse({ type: PostEntity })
  @Permissions('system:post:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, user, updatePostDto);
  }

  /**
   * 删除岗位
   */
  @Delete(':id')
  @Permissions('system:post:delete')
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
