const { v4: uuidv4 } = require('uuid');

class Survey {
  constructor(title, createdBy) {
    this.id = uuidv4();
    this.title = title;
    this.createdBy = createdBy;
    this.questions = [];
    this.createdAt = new Date();
    this.isActive = true;
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  getQuestion(questionId) {
    return this.questions.find(q => q.id === questionId);
  }
}

module.exports = Survey;

