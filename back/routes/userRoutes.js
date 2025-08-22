const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', protect({ roles: ['admin', 'superadmin'] }), userController.getUsers);
router.put('/:id', protect(['admin', 'superadmin']), userController.updateUser);
router.delete('/:id', protect(['admin', 'superadmin']), userController.deleteUser);
router.post('/forgotpwd',userController.forgotpwd);
router.post('/resetpwd',userController.resetpwd);

module.exports = router;