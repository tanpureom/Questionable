const { PromptCollection, validatePrompt } = require('../models/PromptSchema.js');

const { UserCollection } = require('../models/UserModel.js');

const handleGeneratePrompt = async (req, res) => {
  try {
    const { prompt, responseText, username } = req.body;

    // console.log(req.body);

    // console.log(prompt)
    // console.log(responseText)
    // console.log(username)

    // Validate if required data is provided
    if (!prompt || !responseText || !username) {
      return res.status(400).json({ message: 'All fields are required.', success: false });
    }

    // Check if user exists
    const user = await UserCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.', success: false });
    }

    // Validate the data using Joi
    const { error } = validatePrompt({ prompt, response: responseText, user: user._id });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Save to database
    const newPrompt = new PromptCollection({
      prompt,
      response: responseText,
      user: user._id
    });
    await newPrompt.save();

    // Add prompt to user's promptsGeneratedByUser
    user.promptsGeneratedByUser.push(newPrompt._id);
    await user.save();


    return res.status(201).json({ message: 'Prompt saved successfully.', success: true });
  } catch (error) {
    // console.error('Error in handleGeneratePrompt:', error);
    return res.status(500).json({ message: 'Internal server error.', success: false });
  }
};

const handlePromptHistoryData = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is empty..!!!", promptArray: null, success: false });
  }

  try {
    const user = await UserCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User does not exist..!!!", promptArray: null, success: false });
    }

    const allPrompts = await PromptCollection.find({ user: user._id });

    if (allPrompts.length === 0) {
      return res.status(404).json({ message: "No prompts found for this user.", promptArray: [], success: false });
    }

    res.status(200).json({ message: "Prompts fetched successfully..!!!", promptArray: allPrompts, success: true });
  } catch (error) {
    // console.error("Error fetching prompts:", error);
    res.status(500).json({ message: "Internal server error.", promptArray: null, success: false });
  }
};

module.exports = {
  handleGeneratePrompt,
  handlePromptHistoryData
};
