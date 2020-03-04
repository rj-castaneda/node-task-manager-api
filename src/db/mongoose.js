const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/task-manager-api";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
