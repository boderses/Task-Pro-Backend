import express from "express";
import {
  postColumn,
  updateColumn,
  deleteColumn,
} from "../controllers/columnsController.js";
import { columnSchema } from "../schemas/columnSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authorization } from "../middlewares/authMiddleware.js";
import { isValidId } from "../middlewares/isValidId.js";

const columnsRouter = express.Router();

columnsRouter.post(
  "/",
  authorization,
  validateBody(columnSchema, `missing fields`),
  postColumn,
);

columnsRouter.patch(
  "/:id",
  authorization,
  isValidId,
  validateBody(columnSchema, `missing fields`),
  updateColumn,
);

columnsRouter.delete("/:id", authorization, isValidId, deleteColumn);

export default columnsRouter;
