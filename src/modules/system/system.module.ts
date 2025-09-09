import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '@/modules/auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { BcryptService } from '../auth/hashing/bcrypt.service';
import { HashingService } from '../auth/hashing/hashing.service';
import { DeptController } from './dept/dept.controller';
import { DictController } from './dict/dict.controller';
import { MenuController } from './menu/menu.controller';
import { PostController } from './post/post.controller';
import { RoleController } from './role/role.controller';
import { DeptService } from './dept/dept.service';
import { DictService } from './dict/dict.service';
import { MenuService } from './menu/menu.service';
import { PostService } from './post/post.service';
import { RoleService } from './role/role.service';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [
    UserController,
    DeptController,
    DictController,
    MenuController,
    RoleController,
    PostController,
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    UserService,
    DeptService,
    DictService,
    MenuService,
    RoleService,
    PostService,
  ],
})
export class SystemModule {}
