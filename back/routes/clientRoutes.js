const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect(), clientController.getClients);
router.get('/:id', protect(), clientController.getClient);
router.post('/', protect(['admin', 'superadmin']), clientController.createClient);
router.put('/:id', protect(['admin', 'superadmin']), clientController.updateClient);
router.delete('/:id', protect(['admin', 'superadmin']), clientController.deleteClient);

module.exports = router;