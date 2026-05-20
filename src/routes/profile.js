// backend/src/routes/profile.js
// 个人信息路由 - 负责"接待"个人信息相关的请求

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');

// GET /api/profile - 获取个人信息
router.get('/', getProfile);

// PUT /api/profile - 更新个人信息
router.put('/', updateProfile);

module.exports = router;