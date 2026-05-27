// backend/src/controllers/projectController.js
// 项目管理控制器

const prisma = require('../prisma/client');

// ============ 获取所有项目 ============
const getProjects = async (req, res) => {
  try {
    // 新数据结构：techStack 和 features 是 Json 数组
    // Prisma 会自动解析，无需手动 JSON.parse
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }  // 按创建时间倒序
    });
    res.json({ data: projects });
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// ============ 添加项目 ============
const addProject = async (req, res) => {
  try {
    // 新字段：cover, techStack (Json), github, features (Json)
    const { title, cover, techStack, github, features } = req.body;
    
    const project = await prisma.project.create({
      data: {
        title: title || '未命名项目',
        cover,             // 封面图片 URL
        techStack,         // Json 数组，直接存
        github,            // GitHub URL
        features          // Json 数组，直接存
      }
    });
    
    res.json({ data: project });
  } catch (error) {
    console.error('添加项目失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// ============ 更新项目 ============
const updateProject = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    const { id: bodyId, ...data } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: '缺少项目 ID' });
    }
    
    // techStack 和 features 直接存 Json，无需转换
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data
    });
    
    res.json({ data: project });
  } catch (error) {
    console.error('更新项目失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// ============ 删除项目 ============
const deleteProject = async (req, res) => {
  try {
    // MongoDB → MySQL：前端传的 _id 现在变成 id
    // 可以同时兼容 URL 参数和请求体两种方式
    const id = req.params.id || req.body.id || req.body._id;
    
    if (!id) {
      return res.status(400).json({ error: '缺少项目 ID' });
    }
    
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除项目失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

module.exports = { getProjects, addProject, updateProject, deleteProject };