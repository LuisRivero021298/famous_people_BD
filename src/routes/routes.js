const { Router } = require('express');
const router = Router();
const ConfigurationsController = require('../controllers/ConfigurationsController');

router.get('/configurations/', ConfigurationsController.getConfigurations);

router.post('/save_configurations', ConfigurationsController.saveConfigurations);

router.put('/update_configurations/:id', ConfigurationsController.updateConfigurations);

module.exports = router;