const surveyService = require('./SurveyService');
const responseService = require('./ResponseService');

class RatingService {
  /**
   * Calculate overall rating for a survey
   * Returns average of all question ratings in the survey
   */
  calculateSurveyRating(surveyId) {
    const survey = surveyService.getSurvey(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    if (survey.questions.length === 0) {
      return { rating: 0, totalQuestions: 0, message: 'No questions in survey' };
    }

    let totalRating = 0;
    let questionsWithResponses = 0;

    for (const question of survey.questions) {
      const questionRating = this.calculateQuestionRating(surveyId, question.id);
      if (questionRating.totalResponses > 0) {
        totalRating += questionRating.averageRating;
        questionsWithResponses++;
      }
    }

    const overallRating = questionsWithResponses > 0 
      ? totalRating / questionsWithResponses 
      : 0;

    return {
      surveyId,
      surveyTitle: survey.title,
      overallRating: parseFloat(overallRating.toFixed(2)),
      totalQuestions: survey.questions.length,
      questionsWithResponses,
      calculatedAt: new Date()
    };
  }

  /**
   * Calculate average rating for a particular question
   * Returns weighted average based on option weights
   */
  calculateQuestionRating(surveyId, questionId) {
    const survey = surveyService.getSurvey(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const question = survey.getQuestion(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const responses = responseService.getResponsesForQuestion(questionId);

    if (responses.length === 0) {
      return {
        questionId,
        questionText: question.text,
        averageRating: 0,
        totalResponses: 0,
        message: 'No responses for this question'
      };
    }

    let totalWeight = 0;
    const answerDistribution = {};

    for (const response of responses) {
      const weight = question.getOptionWeight(response.answer);
      totalWeight += weight;
      
      // Track distribution
      if (!answerDistribution[response.answer]) {
        answerDistribution[response.answer] = 0;
      }
      answerDistribution[response.answer]++;
    }

    const averageRating = totalWeight / responses.length;

    return {
      questionId,
      questionText: question.text,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalResponses: responses.length,
      answerDistribution,
      calculatedAt: new Date()
    };
  }
}

module.exports = new RatingService();

