import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('注入数据中...');
  await prisma.role.createMany({
    data: [
      { name: '超级管理员', value: 'admin', order: 1 },
      { name: '普通角色', value: 'common', order: 2 },
    ],
  });
  await prisma.user.create({
    data: {
      username: 'admin',
      password: '$2b$10$kxYSbbQSzJ64r4EIcORm8umQB7GQRLNxWAKHmJalYMzkgRZbAaIDq',
      isAdmin: true,
      nickname: '管理员',
      roles: { connect: { value: 'admin' } },
    },
  });
  // 工作台
  await prisma.menu.create({
    data: {
      name: '首页',
      icon: 'i-ant-design:appstore-outlined',
      order: 1,
      type: 'C',
      path: '/dashboard',
      children: {
        create: [
          {
            name: '工作台',
            type: 'M',
            icon: 'i-ant-design:laptop-outlined',
            order: 1,
            path: '/dashboard/workTable',
          },
        ],
      },
    },
  });
  // 系统管理
  await prisma.menu.create({
    data: {
      name: '系统管理',
      icon: 'i-ant-design:setting-outlined',
      order: 2,
      type: 'C',
      path: '/system',
      children: {
        create: [
          {
            name: '用户管理',
            icon: 'i-ant-design:user-outlined',
            order: 1,
            type: 'M',
            path: '/system/user',
            children: {
              create: [
                { name: '创建', type: 'B', permission: 'system:user:create' },
                { name: '查询', type: 'B', permission: 'system:user:query' },
                { name: '修改', type: 'B', permission: 'system:user:update' },
                { name: '删除', type: 'B', permission: 'system:user:delete' },
              ],
            },
          },
          {
            name: '角色管理',
            icon: 'i-ant-design:usergroup-add-outlined',
            order: 2,
            type: 'M',
            path: '/system/role',
            children: {
              create: [
                { name: '创建', type: 'B', permission: 'system:role:create' },
                { name: '查询', type: 'B', permission: 'system:role:query' },
                { name: '修改', type: 'B', permission: 'system:role:update' },
                { name: '删除', type: 'B', permission: 'system:role:delete' },
              ],
            },
          },
          {
            name: '菜单管理',
            icon: 'i-ant-design:menu-outlined',
            order: 3,
            type: 'M',
            path: '/system/menu',
            children: {
              create: [
                { name: '创建', type: 'B', permission: 'system:menu:create' },
                { name: '查询', type: 'B', permission: 'system:menu:query' },
                { name: '修改', type: 'B', permission: 'system:menu:update' },
                { name: '删除', type: 'B', permission: 'system:menu:delete' },
              ],
            },
          },
          {
            name: '模板管理',
            icon: 'i-ant-design:medicine-box-outlined',
            order: 4,
            type: 'M',
            path: '/system/dictType',
            children: {
              create: [
                {
                  name: '创建',
                  type: 'B',
                  permission: 'system:dictType:create',
                },
                {
                  name: '查询',
                  type: 'B',
                  permission: 'system:dictType:query',
                },
                {
                  name: '修改',
                  type: 'B',
                  permission: 'system:dictType:update',
                },
                {
                  name: '删除',
                  type: 'B',
                  permission: 'system:dictType:delete',
                },
              ],
            },
          },
          {
            name: '关键字管理',
            icon: 'i-ant-design:medicine-box-outlined',
            order: 5,
            type: 'M',
            path: '/system/dictData/:id',
            visible: false,
            children: {
              create: [
                {
                  name: '创建',
                  type: 'B',
                  permission: 'system:dictData:create',
                },
                {
                  name: '查询',
                  type: 'B',
                  permission: 'system:dictData:query',
                },
                {
                  name: '修改',
                  type: 'B',
                  permission: 'system:dictData:update',
                },
                {
                  name: '删除',
                  type: 'B',
                  permission: 'system:dictData:delete',
                },
              ],
            },
          },
          {
            name: '部门管理',
            icon: 'i-ant-design:gold-twotone',
            order: 6,
            type: 'M',
            path: '/system/dept',
            children: {
              create: [
                { name: '创建', type: 'B', permission: 'system:dept:create' },
                { name: '查询', type: 'B', permission: 'system:dept:query' },
                { name: '修改', type: 'B', permission: 'system:dept:update' },
                { name: '删除', type: 'B', permission: 'system:dept:delete' },
              ],
            },
          },
          {
            name: '岗位管理',
            icon: 'i-ant-design:golden-filled',
            order: 7,
            type: 'M',
            path: '/system/post',
            children: {
              create: [
                { name: '创建', type: 'B', permission: 'system:post:create' },
                { name: '查询', type: 'B', permission: 'system:post:query' },
                { name: '修改', type: 'B', permission: 'system:post:update' },
                { name: '删除', type: 'B', permission: 'system:post:delete' },
              ],
            },
          },
        ],
      },
    },
  });
  // 系统监控
  await prisma.menu.create({
    data: {
      name: '系统监控',
      icon: 'i-ant-design:android-filled',
      order: 4,
      type: 'C',
      path: '/monitor',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '在线用户',
            icon: 'i-ant-design:aim-outlined',
            order: 1,
            type: 'M',
            path: '/monitor/online',
            createBy: 'admin',
            children: {
              create: [
                { name: '查询', type: 'B', permission: 'monitor:online:query' },
                {
                  name: '强退',
                  type: 'B',
                  permission: 'monitor:online:forceLogout',
                },
              ],
            },
          },
          {
            name: '登录日志',
            order: 2,
            icon: 'i-ant-design:contacts-outlined',
            type: 'M',
            path: '/monitor/loginLog',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '查询',
                  type: 'B',
                  permission: 'monitor:loginLog:query',
                },
              ],
            },
          },
          {
            name: '操作日志',
            order: 3,
            icon: 'i-ant-design:cloud-server-outlined',
            type: 'M',
            path: '/monitor/operationLog',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '查询',
                  type: 'B',
                  permission: 'monitor:operationLog:query',
                },
              ],
            },
          },
          {
            name: '服务器监控',
            icon: 'i-ant-design:fund-projection-screen-outlined',
            order: 4,
            path: '/monitor/info',
            type: 'M',
            createBy: 'admin',
            children: {
              create: [
                { name: '查询', type: 'B', permission: 'monitor:info:query' },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('注入数据成功');
}
main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
