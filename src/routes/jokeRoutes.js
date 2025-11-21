const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');

router.post('/action', jokeController.toggleLike);
router.post('/save', jokeController.toggleSave);
router.get('/saved', jokeController.getSaved);

module.exports = router;
