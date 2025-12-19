import { Router } from "express";
import {
  deleteCurrentUser,
  getUserDetail,
  updateUserDetail,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getUserDetail);
userRouter.patch("/", updateUserDetail);
userRouter.delete("/", deleteCurrentUser);

export default userRouter;
