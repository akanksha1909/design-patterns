const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/RatingController');

router.get('/survey/:surveyId', ratingController.getSurveyRating);
router.get('/survey/:surveyId/question/:questionId', ratingController.getQuestionRating);

module.exports = router;

