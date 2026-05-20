// backend/src/routes/project.js

const express = require('express');
const router = express.Router();
const { getProjects, addProject, updateProject, deleteProject } = require('../controllers/projectController');

router.get('/', getProjects);
router.post('/', addProject);
router.put('/', updateProject);
router.delete('/', deleteProject);

module.exports = router;