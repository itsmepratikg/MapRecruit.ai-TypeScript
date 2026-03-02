const mongoose = require('mongoose');
const QuestionSchema = require('./schemas/QuestionSchema');

// A standalone collection representing distinct Questionnaires / Question items
const Questionnaire = mongoose.model('Questionnaire', QuestionSchema, 'questionnaires');

module.exports = Questionnaire;
