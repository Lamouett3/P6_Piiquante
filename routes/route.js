const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/controller');

router.post('/', sauceCtrl.createSauce);

router.put('/:id', sauceCtrl.modifySauce);

router.delete('/:id', sauceCtrl.deleteSauce);

router.get('/:id', sauceCtrl.getOneSauce);

router.use('/', sauceCtrl.getAllSauce);

module.exports = router;