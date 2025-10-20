// Core Module
const path = require('path');

// External Module
const express = require('express');
const DB_PATH = "mongodb+srv://root:root@learnnodejs.c5ng8ha.mongodb.net/todo?retryWrites=true&w=majority&appName=LearnNodeJs";
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const todoItemRouter = require('./routes/todoItemRouter');
const errorsController = require('./controllers/errors');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/todo", todoItemRouter);
app.use(errorsController.pageNotFound);

const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
  console.log("connected to mongo");
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error in connecting with database: ', err);
});