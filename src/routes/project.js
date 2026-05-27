// backend/src/routes/project.js

const express = require('express');
const router = express.Router();
const { getProjects, addProject, updateProject, deleteProject } = require('../controllers/projectController');
const authenticate = require('../middleware/auth');

// 公开接口：谁都能看
router.get('/', getProjects);

// 需要登录才能操作的接口，加 authenticate 中间件
router.post('/', authenticate, addProject);
router.put('/:id', authenticate, updateProject);
router.put('/', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);
router.delete('/', authenticate, deleteProject);

module.exports = router;