// backend/src/controllers/awardController.js
// 奖项管理控制器

const prisma = require('../prisma/client');

// 获取所有奖项
const getAwards = async (req, res) => {
  try {
    const awards = await prisma.award.findMany({
      orderBy: { createdAt: 'desc' }  // 按创建时间倒序
    });
    res.json({ data: awards });
  } catch (error) {
    console.error('获取奖项失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 添加奖项
// 新字段：title, level（原 name → title）
const addAward = async (req, res) => {
  try {
    const { title, level } = req.body;
    
    const award = await prisma.award.create({
      data: {
        title: title || '未命名奖项',
        level,                    // 奖项级别
      }
    });
    
    res.json({ data: award });
  } catch (error) {
    console.error('添加奖项失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 更新奖项
const updateAward = async (req, res) => {
  try {
    const { id, _id, title, level } = req.body;
    
    // MongoDB → MySQL：兼容 _id 和 id
    const awardId = id || _id;
    
    if (!awardId) {
      return res.status(400).json({ error: '缺少奖项 ID' });
    }
    
    const award = await prisma.award.update({
      where: { id: parseInt(awardId) },
      data: { title, level }
    });
    
    res.json({ data: award });
  } catch (error) {
    console.error('更新奖项失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 删除奖项
const deleteAward = async (req, res) => {
  try {
    const { id, _id } = req.body;
    const awardId = id || _id;
    
    if (!awardId) {
      return res.status(400).json({ error: '缺少奖项 ID' });
    }
    
    await prisma.award.delete({
      where: { id: parseInt(awardId) }
    });
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除奖项失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

module.exports = { getAwards, addAward, updateAward, deleteAward };