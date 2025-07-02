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
import { DeptService } from './dept.service';
import { CreateDeptDto, QueryDeptDto, UpdateDeptDto } from './dept.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { DeptEntity } from './dept.entity';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';

@ApiTags('部门管理')
@ApiBearerAuth('bearer')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}
  /**
   * 创建部门
   */
  @Post()
  @ApiCreatedResponse({ type: DeptEntity })
  @Permissions('system:dept:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDeptDto: CreateDeptDto,
  ) {
    return this.deptService.create(user, createDeptDto);
  }

  /**
   * 获取部门列表
   */
  @Get()
  @ApiOkResponse({ type: DeptEntity, isArray: true })
  @Permissions('system:dept:query')
  findAll(@Query() queryDeptDto: QueryDeptDto) {
    return this.deptService.findAll(queryDeptDto);
  }

  /**
   * 获取部门详情
   */
  @Get(':id')
  @ApiOkResponse({ type: DeptEntity })
  @Permissions('system:dept:query')
  findOne(@Param('id') id: number) {
    return this.deptService.findOne(id);
  }

  /**
   * 更新部门
   */
  @Patch(':id')
  @ApiOkResponse({ type: DeptEntity })
  @Permissions('system:dept:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDeptDto: UpdateDeptDto,
  ) {
    return this.deptService.update(id, user, updateDeptDto);
  }

  /**
   * 删除部门
   */
  @Delete(':id')
  @Permissions('system:dept:delete')
  remove(@Param('id') id: number) {
    return this.deptService.remove(id);
  }
}
