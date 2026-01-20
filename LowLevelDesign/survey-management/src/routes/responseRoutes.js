const express = require('express');
const router = express.Router();
const responseController = require('../controllers/ResponseController');

router.post('/', responseController.submitResponse);
router.get('/question/:questionId', responseController.getQuestionResponses);

module.exports = router;

