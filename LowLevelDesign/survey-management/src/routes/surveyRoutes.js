const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/SurveyController');

router.post('/', surveyController.createSurvey);
router.get('/', surveyController.getAllSurveys);
router.get('/:surveyId', surveyController.getSurvey);
router.post('/:surveyId/questions', surveyController.addQuestion);

module.exports = router;

