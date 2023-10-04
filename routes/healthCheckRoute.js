const express=require('express');
const router =express.Router();
const healthCheckController=require('../controller/healthCheckController');
router.use('/healthz', healthCheckController);

module.exports = router;
