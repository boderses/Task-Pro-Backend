import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateTheme,
  updateUser,
} from "../controllers/authControllers.js";
import { google } from "../controllers/google.js";
import { googleRedirect } from "../controllers/googleRedirect.js";
import { authorization } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  themeSchema,
  registerUserSchema,
  loginUserSchema,
} from "../schemas/usersSchemas.js";
import upload from "../middlewares/upload.js";
import { controllerWrapper } from "../helpers/controllerWrapper.js";
const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), registerUser);
authRouter.post("/login", validateBody(loginUserSchema), loginUser);
authRouter.get("/current", authorization, getCurrentUser);
authRouter.post("/logout", authorization, logoutUser);
authRouter.patch(
  "/themes",
  authorization,
  validateBody(themeSchema),
  updateTheme,
);
authRouter.patch("/update", authorization, upload.single("avatar"), updateUser);
authRouter.get("/google", controllerWrapper(google));
authRouter.get("/google-redirect", controllerWrapper(googleRedirect));

export default authRouter;
