const Response = require('../models/Response');
const surveyService = require('./SurveyService');
const lockManager = require('../middleware/lockManager');

class ResponseService {
  constructor() {
    this.responses = new Map(); // responseId -> Response
    this.userResponses = new Map(); // userId -> Set of responseIds
    this.questionResponses = new Map(); // questionId -> Array of responseIds
  }

  async submitResponse(surveyId, questionId, userId, answer) {
    // Validate survey and question exist
    const survey = surveyService.getSurvey(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const question = survey.getQuestion(questionId);
    if (!question) {
      throw new Error('Question not found in survey');
    }

    // Validate answer option
    if (!question.isValidOption(answer)) {
      throw new Error(`Invalid answer option: ${answer}`);
    }

    // Acquire lock for this question to handle concurrency
    await lockManager.acquireLock(questionId);

    try {
      // Check if user already responded to this question
      const existingResponse = this.findUserResponseForQuestion(userId, questionId);
      if (existingResponse) {
        // Update existing response
        existingResponse.answer = answer;
        existingResponse.submittedAt = new Date();
        return existingResponse;
      }

      // Create new response
      const response = new Response(surveyId, questionId, userId, answer);
      this.responses.set(response.id, response);

      // Update indices
      if (!this.userResponses.has(userId)) {
        this.userResponses.set(userId, new Set());
      }
      this.userResponses.get(userId).add(response.id);

      if (!this.questionResponses.has(questionId)) {
        this.questionResponses.set(questionId, []);
      }
      this.questionResponses.get(questionId).push(response.id);

      return response;
    } finally {
      // Always release lock
      lockManager.releaseLock(questionId);
    }
  }

  findUserResponseForQuestion(userId, questionId) {
    const userResponseIds = this.userResponses.get(userId);
    if (!userResponseIds) return null;

    for (const responseId of userResponseIds) {
      const response = this.responses.get(responseId);
      if (response && response.questionId === questionId) {
        return response;
      }
    }
    return null;
  }

  getResponsesForQuestion(questionId) {
    const responseIds = this.questionResponses.get(questionId) || [];
    return responseIds.map(id => this.responses.get(id)).filter(r => r);
  }

  getResponsesForSurvey(surveyId) {
    return Array.from(this.responses.values()).filter(r => r.surveyId === surveyId);
  }
}

module.exports = new ResponseService();

