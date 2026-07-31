const express = require('express');
const { getLogsHandler } = require('../controllers/logController');

const router = express.Router();

router.get('/', getLogsHandler);

module.exports = router;
