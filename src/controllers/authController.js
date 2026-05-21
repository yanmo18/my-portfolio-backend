// backend/src/controllers/authController.js
// 认证控制器 - 处理注册、登录

const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT 过期时间
const JWT_EXPIRES_IN = '7d';

// ============ 注册 ============
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }
    
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
    
    // 生成 Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      data: {
        token,
        user: { id: user.id, username: user.username }
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// ============ 登录 ============
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 生成 Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      data: {
        token,
        user: { id: user.id, username: user.username }
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

module.exports = { register, login };