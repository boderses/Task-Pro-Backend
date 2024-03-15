import express from "express";
import { authorization } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { addTaskSchema } from "../schemas/addTaskSchema.js";
import { upTaskSchema } from "../schemas/upTaskSchema.js";
import { replaceTaskSchema } from "../schemas/replaceTaskSchema.js";
import {
  postTask,
  deleteTask,
  updateTask,
  replaceTask,
} from "../controllers/taskController.js";

const tasksRouter = express.Router();

tasksRouter.post(
  "/",
  authorization,
  validateBody(addTaskSchema, `missing fields`),
  postTask,
);

tasksRouter.delete("/:id", authorization, isValidId, deleteTask);

tasksRouter.patch(
  "/:id",
  authorization,
  isValidId,
  validateBody(upTaskSchema, `missing fields`),
  updateTask,
);

tasksRouter.post(
  "/:id/replace",
  authorization,
  isValidId,
  validateBody(replaceTaskSchema, `missing fields`),
  replaceTask,
);

export default tasksRouter;
