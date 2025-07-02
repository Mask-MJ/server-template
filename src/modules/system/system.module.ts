import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '@/modules/auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { BcryptService } from '../auth/hashing/bcrypt.service';
import { HashingService } from '../auth/hashing/hashing.service';
import { DeptController } from './dept/dept.controller';
import { DictDataController } from './dict-data/dict-data.controller';
import { DictTypeController } from './dict-type/dict-type.controller';
import { MenuController } from './menu/menu.controller';
import { PostController } from './post/post.controller';
import { RoleController } from './role/role.controller';
import { DeptService } from './dept/dept.service';
import { DictDataService } from './dict-data/dict-data.service';
import { DictTypeService } from './dict-type/dict-type.service';
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
    DictDataController,
    DictTypeController,
    MenuController,
    RoleController,
    PostController,
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    UserService,
    DeptService,
    DictDataService,
    DictTypeService,
    MenuService,
    RoleService,
    PostService,
  ],
})
export class SystemModule {}
