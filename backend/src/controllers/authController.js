export const signup_get = (req, res) => {
  res.send("signup");
};

export const login_get = (req, res) => {
  res.send("login");
};

export const signup_post = (req, res) => {
  res.send("new signup");
};

export const login_post = (req, res) => {
  console.log({ req: req.body });
  res.send("user login");
};
