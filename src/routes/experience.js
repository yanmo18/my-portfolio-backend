// backend/src/routes/experience.js

const express = require('express');
const router = express.Router();
const { getExperience, addExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');

router.get('/', getExperience);
router.post('/', addExperience);
router.put('/', updateExperience);
router.delete('/', deleteExperience);

module.exports = router;