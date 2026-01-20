const { v4: uuidv4 } = require('uuid');

class Response {
  constructor(surveyId, questionId, userId, answer) {
    this.id = uuidv4();
    this.surveyId = surveyId;
    this.questionId = questionId;
    this.userId = userId;
    this.answer = answer; // option label like 'Good', 'Very Good', 'Poor'
    this.submittedAt = new Date();
  }
}

module.exports = Response;

