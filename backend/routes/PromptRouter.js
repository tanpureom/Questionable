const express = require('express');
const { handleGeneratePrompt, handlePromptHistoryData } = require('../controllers/PromptController.js');

const PromptRouter = express.Router();

PromptRouter.route('/generateprompt').post(handleGeneratePrompt);
PromptRouter.route('/home/prompts').post(handlePromptHistoryData);

module.exports = PromptRouter;