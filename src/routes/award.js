// backend/src/routes/award.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getAwards, addAward, updateAward, deleteAward } = require('../controllers/awardController');

router.get('/', getAwards);
router.post('/', authenticate, addAward);
router.put('/', authenticate, updateAward);
router.delete('/', authenticate, deleteAward);

module.exports = router;