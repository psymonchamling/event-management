import User from "../models/User.js";

const handleError = (err) => {
  console.log({ err });
  let finalError = { email: "", password: "" };

  //dublication error
  if (err?.code === 11000) {
    console.log("err same email");
    finalError.email = "That email is already registered.";
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

export const signup_get = (req, res) => {
  res.send("signup");
};

export const login_get = (req, res) => {
  res.send("login");
};

export const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
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
