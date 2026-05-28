// backend/src/controllers/profileController.js
// 个人信息控制器 - 负责处理"个人信息"相关的业务逻辑

const prisma = require('../prisma/client');

// ============ 获取个人信息 ============
// GET /api/profile
const getProfile = async (req, res) => {
  try {
    // Prisma 查询：找第一条 Profile 记录
    // 如果没有，返回提示让用户先创建
    const profile = await prisma.profile.findFirst();
    
    if (!profile) {
      return res.status(404).json({
        error: '还没有个人信息，请先创建！'
      });
    }
    
    res.json({ data: profile });
  } catch (error) {
    console.error('获取个人信息失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// ============ 更新个人信息 ============
// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    // 新数据结构：contact、skills 和 certifications 是 Json 对象/数组
    const { name, education, politicalStatus, birthDate, bio, contact, skills, certifications } = req.body;
    
    // 查找现有记录
    const existing = await prisma.profile.findFirst();
    
    let profile;
    
    if (existing) {
      // 已有记录，更新它
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          name, 
          education, 
          politicalStatus, 
          birthDate, 
          bio, 
          contact,      // Json 类型，直接存对象
          skills,        // Json 类型，直接存数组
          certifications // Json 类型，直接存数组
        }
      });
    } else {
      // 没有记录，创建新的
      profile = await prisma.profile.create({
        data: {
          name: name || '',
          education,
          politicalStatus,
          birthDate,
          bio,
          contact,      // 直接存 Json
          skills,       // 直接存 Json
          certifications // 直接存 Json
        }
      });
    }
    
    res.json({ data: profile });
  } catch (error) {
    console.error('更新个人信息失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

module.exports = { getProfile, updateProfile };