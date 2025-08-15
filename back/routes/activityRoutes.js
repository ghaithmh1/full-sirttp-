const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect(['admin', 'superadmin']), activityController.getActivities);
router.get('/:model/:id', protect(['admin', 'superadmin']), activityController.getEntityActivities);

module.exports = router;