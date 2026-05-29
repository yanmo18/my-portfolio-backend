// backend/src/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ============ 中间件 ============
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 请求日志
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.path}`);
  next();
});

// ============ 路由（迎接不同类型的顾客） ============

// 导入路由
const profileRouter = require('./routes/profile');
const projectRouter = require('./routes/project');
const awardRouter = require('./routes/award');
const experienceRouter = require('./routes/experience');
const authRouter = require('./routes/auth');

// 注册路由
// ⚠️ 项目要求：图片使用 URL 输入方式，不做上传存储，所以没有简历上传接口
app.use('/get-profile', profileRouter);
app.use('/update-profile', profileRouter);
app.use('/api/profile', profileRouter);
app.use('/api/projects', projectRouter);
app.use('/api/project', projectRouter);
app.use('/get-projects', projectRouter);
app.use('/add-project', projectRouter);
app.use('/update-project', projectRouter);
app.use('/api/awards', awardRouter);
app.use('/api/award', awardRouter);
app.use('/get-awards', awardRouter);
app.use('/add-award', awardRouter);
app.use('/delete-award', awardRouter);
app.use('/api/experiences', experienceRouter);
app.use('/api/experience', experienceRouter);
app.use('/get-experience', experienceRouter);
app.use('/add-experience', experienceRouter);
app.use('/update-experience', experienceRouter);
app.use('/api/auth', authRouter);

// ============ 启动服务器 ============
const PORT = process.env.PORT || 5000;

// 先测试数据库连接
const prisma = require('./prisma/client');

async function startServer() {
  try {
    // 测试数据库连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功！');
    
    app.listen(PORT, () => {
      console.log(`
  ╔═══════════════════════════════════════╗
  ║  🏪 Express 后端小店全面营业！        ║
  ║  📍 地址: http://localhost:${PORT}        ║
  ║  📋 接口列表:                          ║
  ║     GET    /api/profile               ║
  ║     PUT    /api/profile               ║
  ║     GET    /api/project               ║
  ║     POST   /api/project              ║
  ║     PUT    /api/project              ║
  ║     DELETE /api/project              ║
  ║     GET    /api/award                ║
  ║     ...更多接口...                     ║
  ╚═══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
}

startServer();