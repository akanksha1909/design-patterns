const ratingService = require('../services/RatingService');

class RatingController {
  getSurveyRating(req, res) {
    try {
      const { surveyId } = req.params;
      const rating = ratingService.calculateSurveyRating(surveyId);
      res.json(rating);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getQuestionRating(req, res) {
    try {
      const { surveyId, questionId } = req.params;
      const rating = ratingService.calculateQuestionRating(surveyId, questionId);
      res.json(rating);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RatingController();

