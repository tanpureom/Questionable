const express = require('express');
const { handleQuestions, fetchQuestionPapers, downloadQuestionPaper, deleteQuestionPaper } = require('../controllers/QuestionsController.js');

const QuestionsRouter = express.Router();

QuestionsRouter.route('/generatequestions').post(handleQuestions);
QuestionsRouter.route('/papers').post(fetchQuestionPapers);
QuestionsRouter.route('/downloadquestionpaper/:fileid').get(downloadQuestionPaper);
QuestionsRouter.route('/deletequetionpaper').post(deleteQuestionPaper);

// Route
// QuestionsRouter.get('/downloadquestionpaper/:fileid', downloadQuestionPaper);

module.exports = QuestionsRouter;