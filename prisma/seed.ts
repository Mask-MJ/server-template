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
      name: '概览',
      title: 'dashboard.title',
      icon: 'i-ant-design:appstore-outlined',
      order: 1,
      type: 'catalog',
      path: '/dashboard',
      children: {
        create: [
          {
            name: '分析页',
            title: 'dashboard.analytics',
            type: 'menu',
            icon: 'i-ant-design:area-chart-outlined',
            order: 1,
            path: '/dashboard/analytics',
          },
          {
            name: '工作台',
            title: 'dashboard.workspace',
            type: 'menu',
            icon: 'i-ant-design:laptop-outlined',
            order: 2,
            path: '/dashboard/workspace',
          },
        ],
      },
    },
  });
  // 系统管理
  await prisma.menu.create({
    data: {
      name: '系统管理',
      title: 'system.title',
      icon: 'i-ant-design:setting-outlined',
      order: 2,
      type: 'catalog',
      path: '/system',
      children: {
        create: [
          {
            name: '用户管理',
            title: 'system.user',
            icon: 'i-ant-design:user-outlined',
            order: 1,
            type: 'menu',
            path: '/system/user',
            children: {
              create: [
                {
                  name: '创建',
                  type: 'button',
                  permission: 'system:user:create',
                },
                {
                  name: '查询',
                  type: 'button',
                  permission: 'system:user:query',
                },
                {
                  name: '修改',
                  type: 'button',
                  permission: 'system:user:update',
                },
                {
                  name: '删除',
                  type: 'button',
                  permission: 'system:user:delete',
                },
              ],
            },
          },
          {
            name: '角色管理',
            title: 'system.role',
            icon: 'i-ant-design:usergroup-add-outlined',
            order: 2,
            type: 'menu',
            path: '/system/role',
            children: {
              create: [
                {
                  name: '创建',
                  type: 'button',
                  permission: 'system:role:create',
                },
                {
                  name: '查询',
                  type: 'button',
                  permission: 'system:role:query',
                },
                {
                  name: '修改',
                  type: 'button',
                  permission: 'system:role:update',
                },
                {
                  name: '删除',
                  type: 'button',
                  permission: 'system:role:delete',
                },
              ],
            },
          },
          {
            name: '菜单管理',
            title: 'system.menu',
            icon: 'i-ant-design:menu-outlined',
            order: 3,
            type: 'menu',
            path: '/system/menu',
            children: {
              create: [
                {
                  name: '创建',
                  type: 'button',
                  permission: 'system:menu:create',
                },
                {
                  name: '查询',
                  type: 'button',
                  permission: 'system:menu:query',
                },
                {
                  name: '修改',
                  type: 'button',
                  permission: 'system:menu:update',
                },
                {
                  name: '删除',
                  type: 'button',
                  permission: 'system:menu:delete',
                },
              ],
            },
          },
          {
            name: '字典管理',
            title: 'system.dict',
            icon: 'i-ant-design:medicine-box-outlined',
            order: 4,
            type: 'menu',
            path: '/system/dict',
            children: {
              create: [
                {
                  name: '创建字典',
                  type: 'button',
                  permission: 'system:dictType:create',
                },
                {
                  name: '查询字典',
                  type: 'button',
                  permission: 'system:dictType:query',
                },
                {
                  name: '修改字典',
                  type: 'button',
                  permission: 'system:dictType:update',
                },
                {
                  name: '删除字典',
                  type: 'button',
                  permission: 'system:dictType:delete',
                },
                {
                  name: '创建字典数据',
                  type: 'button',
                  permission: 'system:dictData:create',
                },
                {
                  name: '查询字典数据',
                  type: 'button',
                  permission: 'system:dictData:query',
                },
                {
                  name: '修改字典数据',
                  type: 'button',
                  permission: 'system:dictData:update',
                },
                {
                  name: '删除字典数据',
                  type: 'button',
                  permission: 'system:dictData:delete',
                },
              ],
            },
          },
          {
            name: '部门管理',
            title: 'system.dept',
            icon: 'i-ant-design:gold-twotone',
            order: 6,
            type: 'menu',
            path: '/system/dept',
            children: {
              create: [
                {
                  name: '创建',
                  type: 'button',
                  permission: 'system:dept:create',
                },
                {
                  name: '查询',
                  type: 'button',
                  permission: 'system:dept:query',
                },
                {
                  name: '修改',
                  type: 'button',
                  permission: 'system:dept:update',
                },
                {
                  name: '删除',
                  type: 'button',
                  permission: 'system:dept:delete',
                },
              ],
            },
          },
          {
            name: '岗位管理',
            title: 'system.post',
            icon: 'i-ant-design:deployment-unit-outlined',
            order: 7,
            type: 'menu',
            path: '/system/post',
            children: {
              create: [
                {
                  name: '创建',
                  type: 'button',
                  permission: 'system:post:create',
                },
                {
                  name: '查询',
                  type: 'button',
                  permission: 'system:post:query',
                },
                {
                  name: '修改',
                  type: 'button',
                  permission: 'system:post:update',
                },
                {
                  name: '删除',
                  type: 'button',
                  permission: 'system:post:delete',
                },
              ],
            },
          },
          {
            name: '知识库管理',
            title: 'system.knowledgeBase',
            icon: 'i-ant-design:database-outlined',
            order: 7,
            type: 'menu',
            path: '/system/knowledgeBase',
            children: {
              create: [
                {
                  name: '创建',
                  type: 'button',
                  permission: 'system:knowledgeBase:create',
                },
                {
                  name: '查询',
                  type: 'button',
                  permission: 'system:knowledgeBase:query',
                },
                {
                  name: '修改',
                  type: 'button',
                  permission: 'system:knowledgeBase:update',
                },
                {
                  name: '删除',
                  type: 'button',
                  permission: 'system:knowledgeBase:delete',
                },
              ],
            },
          },
          {
            name: '文件管理',
            title: 'system.document',
            icon: 'i-ant-design:database-outlined',
            order: 7,
            type: 'menu',
            path: '/system/document/:id',
            hideInBreadcrumb: true,
            hideInMenu: true,
            children: {
              create: [
                {
                  name: '上传文件',
                  type: 'button',
                  permission: 'system:document:upload',
                },
                {
                  name: '解析文件',
                  type: 'button',
                  permission: 'system:document:parse',
                },
                {
                  name: '查询文件列表',
                  type: 'button',
                  permission: 'system:document:query',
                },
                {
                  name: '修改文件',
                  type: 'button',
                  permission: 'system:document:update',
                },
                {
                  name: '删除文件',
                  type: 'button',
                  permission: 'system:document:delete',
                },
                {
                  name: '下载文件',
                  type: 'button',
                  permission: 'system:document:download',
                },
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
      title: 'monitor.title',
      icon: 'i-ant-design:android-filled',
      order: 4,
      type: 'catalog',
      path: '/monitor',
      children: {
        create: [
          {
            name: '在线用户',
            title: 'monitor.online',
            icon: 'i-ant-design:aim-outlined',
            order: 1,
            type: 'menu',
            path: '/monitor/online',
            children: {
              create: [
                {
                  name: '查询',
                  type: 'button',
                  permission: 'monitor:online:query',
                },
                {
                  name: '强退',
                  type: 'button',
                  permission: 'monitor:online:forceLogout',
                },
              ],
            },
          },
          {
            name: '登录日志',
            title: 'monitor.loginLog',
            order: 2,
            icon: 'i-ant-design:contacts-outlined',
            type: 'menu',
            path: '/monitor/loginLog',
            children: {
              create: [
                {
                  name: '查询',
                  type: 'button',
                  permission: 'monitor:loginLog:query',
                },
              ],
            },
          },
          {
            name: '操作日志',
            title: 'monitor.operationLog',
            order: 3,
            icon: 'i-ant-design:cloud-server-outlined',
            type: 'menu',
            path: '/monitor/operationLog',
            children: {
              create: [
                {
                  name: '查询',
                  type: 'button',
                  permission: 'monitor:operationLog:query',
                },
              ],
            },
          },
          {
            name: '服务器监控',
            title: 'monitor.info',
            icon: 'i-ant-design:fund-projection-screen-outlined',
            order: 4,
            path: '/monitor/info',
            type: 'menu',
            children: {
              create: [
                {
                  name: '查询',
                  type: 'button',
                  permission: 'monitor:info:query',
                },
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
