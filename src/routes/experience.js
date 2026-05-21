// backend/src/routes/experience.js

const express = require('express');
const router = express.Router();
const { getExperience, addExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');


// experience.js
router.get('/', getExperience);
router.post('/', authenticate, addExperience);
router.put('/', authenticate, updateExperience);
router.delete('/', authenticate, deleteExperience);

module.exports = router;