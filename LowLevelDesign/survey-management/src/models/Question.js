const { v4: uuidv4 } = require('uuid');

class Question {
  constructor(text, options) {
    this.id = uuidv4();
    this.text = text;
    this.options = options; // [{ label: 'Good', weight: 3 }, { label: 'Very Good', weight: 5 }, { label: 'Poor', weight: 1 }]
    this.createdAt = new Date();
  }

  getOptionWeight(optionLabel) {
    const option = this.options.find(opt => opt.label === optionLabel);
    return option ? option.weight : 0;
  }

  isValidOption(optionLabel) {
    return this.options.some(opt => opt.label === optionLabel);
  }
}

module.exports = Question;

