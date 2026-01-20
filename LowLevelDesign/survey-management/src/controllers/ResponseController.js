const responseService = require('../services/ResponseService');

class ResponseController {
  async submitResponse(req, res) {
    try {
      const { surveyId, questionId, userId, answer } = req.body;

      if (!surveyId || !questionId || !userId || !answer) {
        return res.status(400).json({ 
          error: 'surveyId, questionId, userId, and answer are required' 
        });
      }

      const response = await responseService.submitResponse(
        surveyId, 
        questionId, 
        userId, 
        answer
      );

      res.status(201).json({
        message: 'Response submitted successfully',
        response: {
          id: response.id,
          surveyId: response.surveyId,
          questionId: response.questionId,
          userId: response.userId,
          answer: response.answer,
          submittedAt: response.submittedAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getQuestionResponses(req, res) {
    try {
      const { questionId } = req.params;
      const responses = responseService.getResponsesForQuestion(questionId);
      
      res.json({
        questionId,
        totalResponses: responses.length,
        responses: responses.map(r => ({
          id: r.id,
          userId: r.userId,
          answer: r.answer,
          submittedAt: r.submittedAt
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResponseController();

