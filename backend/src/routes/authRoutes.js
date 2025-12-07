import { Router } from "express";
import {
  login_get,
  login_post,
  signup_get,
  signup_post,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/signup", signup_get);
authRouter.post("/signup", signup_post);
authRouter.get("/login", login_get);
authRouter.post("/login", login_post);

export default authRouter;
