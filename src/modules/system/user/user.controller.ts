import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  QueryUserDto,
  UpdateUserDto,
} from './user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/auth/authorization/decorators/permissions.decorator';
import { ActiveUser } from '@/modules/auth/decorators/active-user.decorator';
import { ActiveUserData } from '@/modules/auth/interfaces/active-user-data.interface';

@ApiBearerAuth('bearer')
@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   */
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @Permissions('system:user:create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 获取用户列表
   */
  @Get()
  @ApiPaginatedResponse(UserEntity)
  findWithPagination(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findWithPagination(queryUserDto);
  }

  /**
   * 获取所有用户列表
   */
  @Get('all')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findAll(queryUserDto);
  }

  /**
   * 获取当前登录用户信息
   */
  @Get('info')
  @ApiOkResponse({ type: UserEntity })
  findSelf(@ActiveUser() user: ActiveUserData) {
    return this.userService.findSelf(user.sub);
  }

  /**
   * 获取当前登录用户权限码
   */
  @Get('code')
  @ApiOkResponse({ type: String, isArray: true })
  findSelfCode(@ActiveUser() user: ActiveUserData) {
    return this.userService.findSelfCode(user.sub);
  }

  /**
   * 修改密码
   */
  @Patch('changePassword')
  @Permissions('system:user:update')
  @ApiOkResponse({ type: UserEntity })
  changePassword(@Body() { id, oldPassword, password }: ChangePasswordDto) {
    return this.userService.changePassword(id, password, oldPassword);
  }

  /**
   * 获取单个用户信息
   */
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  /**
   * 更新用户
   */
  @Patch(':id')
  @Permissions('system:user:update')
  @ApiOkResponse({ type: UserEntity })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  @Permissions('system:user:delete')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.userService.remove(user, id, ip);
  }
}
