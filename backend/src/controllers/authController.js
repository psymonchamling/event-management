import User from "../models/User.js";
import jwt from "jsonwebtoken";

const handleError = (err) => {
  console.log({ err });
  let finalError = { email: "", password: "" };

  //dublication error
  if (err?.code === 11000) {
    console.log("err same email");
    finalError.email = "This email is already registered.";
    return finalError;
  }

  //validation error
  if (err?.message?.includes("user validation failed")) {
    Object.values(err?.errors).forEach(({ properties }) => {
      finalError[properties?.path] = properties?.message;
    });
  }

  return finalError;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "my secret key", {
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
  const { email, password } = req.body;

  console.log(req.body);

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

export const login_post = async (req, res) => {
  const { email, password } = req.body;

  console.log({ req: req.body });
  res.send("user login");
};
