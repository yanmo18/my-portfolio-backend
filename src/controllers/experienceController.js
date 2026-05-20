// backend/src/controllers/experienceController.js
// 经历管理控制器

const prisma = require('../prisma/client');

// 获取所有经历
const getExperience = async (req, res) => {
  try {
    // 新字段：period, organization, role, description
    const experiences = await prisma.experience.findMany({
      orderBy: { createdAt: 'desc' }  // 按创建时间倒序
    });
    res.json({ data: experiences });
  } catch (error) {
    console.error('获取经历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 添加经历
const addExperience = async (req, res) => {
  try {
    const { period, organization, role, description } = req.body;
    
    const experience = await prisma.experience.create({
      data: {
        period,            // 时间段
        organization: organization || '未知',  // 组织
        role,              // 角色
        description        // 描述
      }
    });
    
    res.json({ data: experience });
  } catch (error) {
    console.error('添加经历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 更新经历
const updateExperience = async (req, res) => {
  try {
    const { id, _id, period, organization, role, description } = req.body;
    
    // MongoDB → MySQL：兼容 _id 和 id
    const expId = id || _id;
    
    if (!expId) {
      return res.status(400).json({ error: '缺少经历 ID' });
    }
    
    const experience = await prisma.experience.update({
      where: { id: parseInt(expId) },
      data: { period, organization, role, description }
    });
    
    res.json({ data: experience });
  } catch (error) {
    console.error('更新经历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 删除经历
const deleteExperience = async (req, res) => {
  try {
    const { id, _id } = req.body;
    const expId = id || _id;
    
    if (!expId) {
      return res.status(400).json({ error: '缺少经历 ID' });
    }
    
    await prisma.experience.delete({
      where: { id: parseInt(expId) }
    });
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除经历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

module.exports = { getExperience, addExperience, updateExperience, deleteExperience };