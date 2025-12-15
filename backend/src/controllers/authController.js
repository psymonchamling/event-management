import User from "../models/User.js";
import jwt from "jsonwebtoken";

const secretKey = "Bikash$123@$";

const handleError = (err) => {
  // console.log({ err });
  let finalError = { email: "", password: "" };

  // dublication error
  if (err?.code === 11000) {
    console.log("err same email");
    finalError.email = "This email is already registered.";
    return finalError;
  }

  // login errors (custom messages)
  if (err?.message === "Incorrect email") {
    finalError.email = "Email is not registered";
    // finalError.email = "This email is not registered.";
    return finalError;
  }

  if (err?.message === "Incorrect password") {
    finalError.password = "Password is incorrect";
    // finalError.password = "The password you entered is incorrect.";
    return finalError;
  }

  // validation error
  if (err?.message?.includes("user validation failed")) {
    Object.values(err?.errors).forEach(({ properties }) => {
      finalError[properties?.path] = properties?.message;
    });
  }

  return finalError;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, secretKey, {
    expiresIn: maxAge,
  });
};

export const signup_get = (req, res) => {
  res.send("signup");
};

export const login_get = (req, res) => {
  res.send("login");
};

export const signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body);

  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

export const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    console.log("errors in catch: ", err, errors);
    res.status(400).json({ errors });
  }
};

export const logout_post = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true }); // Default options match
  res.status(200).json({ message: "Logged out" });

  // res.cookie("jwt", "", { maxAge: 1, httpOnly: true });
  // res.status(200).json({ message: "Logged out successfully" });
};
