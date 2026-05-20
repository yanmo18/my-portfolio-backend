// backend/src/routes/award.js

const express = require('express');
const router = express.Router();
const { getAwards, addAward, updateAward, deleteAward } = require('../controllers/awardController');

router.get('/', getAwards);
router.post('/', addAward);
router.put('/', updateAward);
router.delete('/', deleteAward);

module.exports = router;