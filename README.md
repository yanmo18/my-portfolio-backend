# 个人作品集后端服务

基于 Express + Prisma + MySQL 的个人作品集管理后端 API 服务。

## 技术栈

- **框架**: Express.js
- **数据库**: MySQL
- **ORM**: Prisma
- **认证**: JWT
- **密码加密**: bcryptjs

## 快速开始

### 环境要求

- Node.js >= 20.x
- MySQL >= 8.0
- pnpm >= 9.x

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

复制 `.env` 文件并修改配置：

```env
# .env 文件内容
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"
JWT_SECRET="your-secret-key-here-change-in-production"
```

### 数据库迁移

```bash
# 推送 schema 到数据库
pnpm exec prisma db push

# 生成 Prisma Client
pnpm exec prisma generate
```

### 启动服务

```bash
# 开发模式（带热重载）
pnpm dev

# 生产模式
pnpm start
```

服务启动后访问: http://localhost:5000

## API 接口

### 认证接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |

### 个人信息接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/profile | 获取个人信息 | 否 |
| PUT | /api/profile | 更新个人信息 | 是 |

### 项目接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/project | 获取项目列表 | 否 |
| POST | /api/project | 添加项目 | 是 |
| PUT | /api/project | 更新项目 | 是 |
| DELETE | /api/project | 删除项目 | 是 |

### 奖项接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/award | 获取奖项列表 | 否 |
| POST | /api/award | 添加奖项 | 是 |
| PUT | /api/award | 更新奖项 | 是 |
| DELETE | /api/award | 删除奖项 | 是 |

### 经历接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/experience | 获取经历列表 | 否 |
| POST | /api/experience | 添加经历 | 是 |
| PUT | /api/experience | 更新经历 | 是 |
| DELETE | /api/experience | 删除经历 | 是 |

## 使用示例

### 注册管理员

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 登录获取 Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 添加项目（需要认证）

```bash
curl -X POST http://localhost:5000/api/project \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "项目名称",
    "description": "项目描述",
    "technologies": ["JavaScript", "React"],
    "link": "https://github.com"
  }'
```

## 项目结构

```
my-portfolio-backend/
├── src/
│   ├── controllers/     # 控制器（业务逻辑）
│   ├── routes/          # 路由配置
│   ├── middleware/      # 中间件
│   ├── prisma/          # Prisma 配置
│   └── index.js         # 入口文件
├── prisma/              # Prisma schema
├── .env                 # 环境变量
├── package.json         # 项目配置
└── README.md            # 项目说明
```

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# Prisma 命令
pnpm exec prisma studio    # 打开数据库管理界面
pnpm exec prisma migrate   # 数据库迁移
pnpm exec prisma generate  # 生成 Prisma Client
```

## 注意事项

1. 首次运行需要创建数据库并配置 `.env` 文件
2. JWT_SECRET 需要设置一个安全的随机字符串
3. 生产环境需要使用更强的密码和安全配置
4. 建议使用 HTTPS 协议部署

## License

MIT