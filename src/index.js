/*
File: index.js
Description: Creates the express app and gets it up and running
*/

const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  // const task = await Task.findById("5e5d653392d9d015778ed5a3");
  // await task.populate("owner").execPopulate();
  // console.log(task.owner);

  const user = await User.findById("5e5d61f85b2f121254466e55");
  await user.populate("tasks").execPopulate();
  console.log(user.tasks);
};

// main();
