const express = require('express');
const router = express.Router();
const controller = require('../controllers/room_control');

/*GET home page*/
router.get('/', controller.room);

module.exports = router;