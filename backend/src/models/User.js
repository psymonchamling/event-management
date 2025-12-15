import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  // Basic profile
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter a email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },

  // Additional profile fields (all optional, used in dashboard settings)
  bio: {
    type: String,
  },
  organization: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  timezone: {
    type: String,
  },
});

// fire a function before doc is saved to db
userSchema.pre("save", async function () {
  console.log("user about to be created and saved", this);

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// fire a function after doc is saved to db
userSchema.post("save", function (doc) {
  console.log("new user was created and saved", doc);
});

// static method to login user
// NOTE: in Mongoose, use `schema.statics` (or `schema.static("name", fn)`)
// to define static methods on the model.
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (isPasswordCorrect) {
    return user;
  }
  throw Error("Incorrect password");
};

const User = mongoose.model("user", userSchema);

export default User;
