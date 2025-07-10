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
import { MenuService } from './menu.service';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreateMenuDto, QueryMenuDto, UpdateMenuDto } from './menu.dto';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';
import { MenuEntity } from './menu.entity';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';

@ApiTags('菜单管理')
@ApiBearerAuth('bearer')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 创建菜单
   */
  @Post()
  @Permissions('system:menu:create')
  @ApiOkResponse({ type: MenuEntity })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  /**
   * 获取菜单列表
   */
  @Get()
  @Permissions('system:menu:query')
  @ApiOkResponse({ type: MenuEntity, isArray: true })
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryMenuDto: QueryMenuDto,
  ) {
    return this.menuService.findAll(user, queryMenuDto);
  }

  /**
   * 获取菜单详情
   */
  @Get(':id')
  @ApiOkResponse({ type: MenuEntity })
  @Permissions('system:menu:query')
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(id);
  }
  /**
   * 更新菜单
   */
  @Patch(':id')
  @ApiOkResponse({ type: MenuEntity })
  @Permissions('system:menu:update')
  update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }
  /**
   * 删除菜单
   */
  @Delete(':id')
  @Permissions('system:menu:delete')
  remove(@Param('id') id: number) {
    return this.menuService.remove(id);
  }
}
