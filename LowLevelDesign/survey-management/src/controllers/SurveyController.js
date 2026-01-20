const surveyService = require('../services/SurveyService');

class SurveyController {
  createSurvey(req, res) {
    try {
      const { title, createdBy } = req.body;
      
      if (!title || !createdBy) {
        return res.status(400).json({ 
          error: 'Title and createdBy are required' 
        });
      }

      const survey = surveyService.createSurvey(title, createdBy);
      res.status(201).json({
        message: 'Survey created successfully',
        survey: {
          id: survey.id,
          title: survey.title,
          createdBy: survey.createdBy,
          createdAt: survey.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getSurvey(req, res) {
    try {
      const { surveyId } = req.params;
      const survey = surveyService.getSurvey(surveyId);

      if (!survey) {
        return res.status(404).json({ error: 'Survey not found' });
      }

      res.json({
        id: survey.id,
        title: survey.title,
        createdBy: survey.createdBy,
        questions: survey.questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options
        })),
        createdAt: survey.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getAllSurveys(req, res) {
    try {
      const surveys = surveyService.getAllSurveys();
      res.json({
        total: surveys.length,
        surveys: surveys.map(s => ({
          id: s.id,
          title: s.title,
          createdBy: s.createdBy,
          questionCount: s.questions.length,
          createdAt: s.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  addQuestion(req, res) {
    try {
      const { surveyId } = req.params;
      const { text, options } = req.body;

      if (!text || !options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ 
          error: 'Question text and options array are required' 
        });
      }

      // Validate options format
      for (const option of options) {
        if (!option.label || typeof option.weight !== 'number') {
          return res.status(400).json({ 
            error: 'Each option must have label (string) and weight (number)' 
          });
        }
      }

      const question = surveyService.addQuestionToSurvey(surveyId, text, options);
      res.status(201).json({
        message: 'Question added successfully',
        question: {
          id: question.id,
          text: question.text,
          options: question.options
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SurveyController();

