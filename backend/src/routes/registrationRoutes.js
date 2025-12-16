import { Router } from "express";
import { registerForEvent } from "../controllers/registrationController.js";

const registrationRouter = Router();

registrationRouter.post("/", registerForEvent);

export default registrationRouter;
