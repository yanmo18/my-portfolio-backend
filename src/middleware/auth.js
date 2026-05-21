// backend/src/middleware/auth.js
// 鉴权中间件 - 检查请求是否有权访问

const jwt = require('jsonwebtoken');

// 验证 Token 中间件
const authenticate = (req, res, next) => {
  try {
    // 从请求头获取 Token
    // 格式: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: '请先登录' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token 格式错误' });
    }
    
    // 验证 Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 把用户信息挂到 req 上，后面能用
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '登录已过期，请重新登录' });
    }
    return res.status(401).json({ error: '无效的 Token' });
  }
};

module.exports = authenticate;