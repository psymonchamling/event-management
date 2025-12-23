import jwt from "jsonwebtoken";
const secretKey = "Bikash$123@$";

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check json web token exists & is verified
  if (!token) {
    return res.status(400).json({ message: "Not Signed In" });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      console.error({ err });
      return res.status(400).json({ err });
    } else {
      req.userId = decodedToken?.id;
      next();
    }
  });
};

export default requireAuth;
