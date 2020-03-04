const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive number");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password"))
        throw new Error("Must not include word password");
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// virtual attribute
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

// exclude password information
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// methods are used with instances of the object
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// statics is used as model methods (for the collections)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// Hash plain text password before saving it
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
