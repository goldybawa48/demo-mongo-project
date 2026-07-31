const express = require('express');
const { getEnv } = require('../controllers/envController');

const router = express.Router();

router.get('/', getEnv);

module.exports = router;
