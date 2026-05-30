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
| GET | /api/awards | 获取奖项列表 | 否 |
| POST | /api/awards | 添加奖项 | 是 |
| PUT | /api/awards/:id | 更新奖项 | 是 |
| DELETE | /api/awards/:id | 删除奖项 | 是 |

### 经历接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/experiences | 获取经历列表 | 否 |
| POST | /api/experiences | 添加经历 | 是 |
| PUT | /api/experiences/:id | 更新经历 | 是 |
| DELETE | /api/experiences/:id | 删除经历 | 是 |

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

## 🐛 调试与问题解决

本章节详细记录了项目开发过程中遇到的问题、排查思路和解决方案。

---

### 问题一：登录无响应 🚨

**现象描述**
- 点击登录按钮后页面无反应
- 后端日志显示请求已收到但无响应

**排查过程**

1. **检查前端请求**
   - 确认请求已发送到 `http://localhost:5000/api/auth/login`

2. **检查后端路由**
   - 发现路由配置正确，控制器逻辑正常

3. **检查数据库密码**
   - 数据库中存储的密码哈希与前端期望密码不匹配
   - 需要更新数据库中的密码哈希值

**根本原因**
数据库中 admin 用户的密码哈希与前端期望密码 `Fernoa@2024` 不匹配。

**解决方案**
```javascript
// 使用 bcryptjs 重新生成密码哈希
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('Fernoa@2024', 10);
// 更新数据库中 admin 用户的 password 字段
```

**涉及文件**
- 数据库 `User` 表 - admin 用户密码

---

### 问题二：API 路径不匹配 🚨

**现象描述**
```
[error] 获取奖项列表失败，尝试缓存: Error: API error
```

**排查过程**

1. **检查前端 API 调用**
   - 前端使用单数形式：`/api/award`、`/api/experience`

2. **检查后端路由**
   - 后端使用复数形式：`/api/awards`、`/api/experiences`

3. **对比结果**
   | 模块 | 前端调用 | 后端路由 |
   |------|---------|---------|
   | 奖项 | `/api/award` | `/api/awards` ❌ 不匹配 |
   | 经历 | `/api/experience` | `/api/experiences` ❌ 不匹配 |

**根本原因**
前后端 API 路径命名风格不一致：前端使用单数，后端使用复数 RESTful 规范。

**解决方案**
修改后端路由配置，统一使用 RESTful 复数形式：
```javascript
// src/index.js
app.use('/api/awards', awardRouter);     // 复数形式
app.use('/api/experiences', experienceRouter);  // 复数形式
```

**涉及文件**
- `src/index.js` - 路由挂载

---

### 问题三：后端返回 HTML 而非 JSON 🚨

**现象描述**
```
[error] 更新奖项失败: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**排查过程**

1. **分析错误信息**
   - `Unexpected token '<'` 表示后端返回的是 HTML 而非 JSON
   - `<!DOCTYPE` 是 HTML 页面的开头

2. **检查路由匹配**
   - 当请求路径不正确时，Express 返回 404 HTML 页面
   - 前端尝试解析 HTML 为 JSON 导致失败

**根本原因**
请求路径不匹配导致 Express 返回 404 HTML 页面，而非 JSON 响应。

**解决方案**
确保前后端使用一致的 API 路径：
- `PUT /api/awards/:id` - 路径参数方式
- `DELETE /api/awards/:id` - 路径参数方式

**涉及文件**
- `src/index.js` - 路由配置
- `src/routes/award.js` - 奖项路由

---

### 问题四：中文乱码

**现象描述**
- 数据库存储的中文显示为乱码
- 特殊字符（如 emoji）无法保存

**排查过程**

1. **检查数据库连接**
   ```env
   # 问题：缺少 charset=utf8mb4
   DATABASE_URL="mysql://user:pass@localhost:3306/db?charset=utf8"
   ```

2. **检查字段类型**
   - 默认 VARCHAR(191) 长度不足
   - 需要使用 TEXT 类型

**根本原因**
1. MySQL 连接字符串缺少 `charset=utf8mb4`
2. 字段类型不支持 emoji 和特殊字符

**解决方案**
```env
# .env - 添加字符集
DATABASE_URL="mysql://user:pass@localhost:3306/db?charset=utf8mb4"
```

```prisma
# schema.prisma - 使用 TEXT 类型
model Award {
  title String @db.Text
}
```

**涉及文件**
- `.env` - 数据库连接字符串
- `prisma/schema.prisma` - 数据库 schema

---

### 问题五：图片上传失败

**现象描述**
- 上传图片时报错
- Base64 编码的图片数据无法存储

**排查过程**

1. **检查数据库字段类型**
   ```prisma
   model Project {
     cover String?  # 默认 VARCHAR(191) 长度不足
   }
   ```

2. **检查 Express 配置**
   ```javascript
   app.use(express.json({ limit: '100kb' }));  # 限制太小
   ```

**根本原因**
1. `cover` 字段默认映射到 `VARCHAR(191)`，无法存储长 base64 字符串
2. Express 请求体限制 `100KB` 无法支持图片

**解决方案**
```prisma
model Project {
  cover String? @db.LongText  # 使用 LongText 类型
}
```

```javascript
// src/index.js - 增大请求体限制
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

**涉及文件**
- `prisma/schema.prisma` - 数据库 schema
- `src/index.js` - Express 配置

---

### 问题六：DELETE 请求参数错误

**现象描述**
- DELETE 请求无法正确删除数据
- 后端无法获取要删除的资源 ID

**排查过程**

1. **检查前端请求**
   ```javascript
   // 前端使用 body 传递 id
   body: JSON.stringify({ id })
   ```

2. **检查后端路由**
   ```javascript
   // 后端期望路径参数
   router.delete('/:id', deleteAward)
   ```

**根本原因**
前端使用 body 传递 id，而后端路由使用路径参数 `/:id`。

**解决方案**
修改前端 DELETE 请求，使用路径参数：
```javascript
// 前端
fetch(`${API_BASE}/api/awards/${id}`, { method: 'DELETE' })

// 后端
router.delete('/:id', deleteAward)
```

**涉及文件**
- 前端 `src/api/index.js`
- 后端 `src/routes/award.js`

---

## 📊 更新日志

### v2.1.0 (2026.05) - 后端重构与 Bug 修复

**架构升级：**
- ✨ 新增 Express 后端服务（替换 Laf 云函数）
- ✨ 集成 Prisma ORM + MySQL 数据库
- ✨ 实现 JWT 认证机制
- ✨ 新增环境变量配置（`.env`）

**Bug 修复：**
- 🐛 修复登录无响应问题
  - 数据库密码哈希与前端期望密码不匹配
- 🐛 修复 API 路径不匹配问题
  - 奖项接口：`/api/award` → `/api/awards`
  - 经历接口：`/api/experience` → `/api/experiences`
- 🐛 修复后端返回 HTML 而非 JSON 导致的解析错误
- 🐛 修复中文乱码问题
  - 数据库连接添加 `charset=utf8mb4`
  - 字段类型改为 `TEXT` 支持中文
- 🐛 修复图片上传失败
  - 数据库字段 `cover` 从 `text` → `longtext`（支持 base64）
  - Express 请求体限制 `100KB` → `10MB`
- 🐛 修复 DELETE 请求格式错误
  - 从 body 传递 id → 改为路径参数 `/api/{resource}/{id}`

**功能增强：**
- ✨ 完善 API 接口文档
- ✨ 增强错误处理和日志记录
- ✨ 支持大尺寸图片上传（base64 编码）

### v1.0.0 (2025.04)

**初始版本：**
- 📦 基础 Express 服务搭建
- 📦 基础 CRUD API
- 📦 Laf 云函数集成

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

## 调试技巧

1. **查看请求日志**
   - 后端服务终端会显示所有请求日志
   - 格式：`📩 METHOD /path`

2. **数据库检查**
   ```bash
   # 进入 Prisma Studio 查看数据
   npx prisma studio
   ```

3. **检查环境变量**
   - 确保 `.env` 文件存在且配置正确
   - 确保 `DATABASE_URL` 正确

## 注意事项

1. 首次运行需要创建数据库并配置 `.env` 文件
2. JWT_SECRET 需要设置一个安全的随机字符串
3. 生产环境需要使用更强的密码和安全配置
4. 建议使用 HTTPS 协议部署

## License

MIT
