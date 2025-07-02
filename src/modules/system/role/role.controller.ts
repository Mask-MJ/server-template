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
import { RoleService } from './role.service';
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from './role.dto';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RoleEntity } from './role.entity';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from '@/common/response/paginated.response';

@ApiTags('权限管理')
@ApiBearerAuth('bearer')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建权限
   */
  @Post()
  @ApiCreatedResponse({ type: RoleEntity })
  @Permissions('system:role:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.roleService.create(user, createRoleDto);
  }

  /**
   * 获取权限列表
   */
  @Get()
  @ApiPaginatedResponse(RoleEntity)
  @Permissions('system:role:query')
  findAll(@Query() queryRoleDto: QueryRoleDto) {
    return this.roleService.findAll(queryRoleDto);
  }

  /**
   * 获取权限详情
   */
  @Get(':id')
  @ApiOkResponse({ type: RoleEntity })
  @Permissions('system:role:query')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  /**
   * 更新权限
   */
  @Patch(':id')
  @ApiOkResponse({ type: RoleEntity })
  @Permissions('system:role:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, user, updateRoleDto);
  }

  /**
   * 删除权限
   */
  @Delete(':id')
  @Permissions('system:role:delete')
  remove(@Param('id') id: number) {
    return this.roleService.remove(id);
  }
}
