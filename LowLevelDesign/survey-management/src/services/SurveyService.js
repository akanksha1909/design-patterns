const Survey = require('../models/Survey');
const Question = require('../models/Question');

class SurveyService {
  constructor() {
    this.surveys = new Map(); // surveyId -> Survey
  }

  createSurvey(title, createdBy) {
    const survey = new Survey(title, createdBy);
    this.surveys.set(survey.id, survey);
    return survey;
  }

  getSurvey(surveyId) {
    return this.surveys.get(surveyId);
  }

  getAllSurveys() {
    return Array.from(this.surveys.values());
  }

  addQuestionToSurvey(surveyId, questionText, options) {
    const survey = this.surveys.get(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const question = new Question(questionText, options);
    survey.addQuestion(question);
    return question;
  }

  getQuestion(surveyId, questionId) {
    const survey = this.surveys.get(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }
    return survey.getQuestion(questionId);
  }
}

module.exports = new SurveyService();

