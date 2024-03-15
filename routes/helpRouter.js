import express from "express";
import { emailSupport } from "../controllers/authControllers.js";
import { validateBody } from "../middlewares/validateBody.js";
import { helpSchema } from "../schemas/usersSchemas.js";
import { authorization } from "../middlewares/authMiddleware.js";

const helpRouter = express.Router();

helpRouter.post("/", authorization, validateBody(helpSchema), emailSupport);

export default helpRouter;
