const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/connection.js');
const loginRouter = require('./routes/LoginRoutes');
const PromptRouter = require('./routes/PromptRouter.js')
const QuestionsRouter = require('./routes/QuestionRoutes.js');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', loginRouter);
app.use('/', PromptRouter);
app.use('/', QuestionsRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const startserver = () => {
  try {
    connectDB()
      .then(() => {
        app.listen(port, () => {
          console.log(`Listening on the port ${port}`);
        });
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

startserver();