const express=require('express');
const router =express.Router();
const healthCheckController=require('../controller/healthCheckController');
router.use('/health', healthCheckController);

module.exports = router;
