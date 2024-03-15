import express from "express";
import {
  postAddBoard,
  getOneBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardsController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { addBoardSchema } from "../schemas/addBoardSchema.js";
import { updateBoardSchema } from "../schemas/updateBoardSchema.js";
import { authorization } from "../middlewares/authMiddleware.js";

const boardsRouter = express.Router();

boardsRouter.post(
  "/",
  authorization,
  validateBody(addBoardSchema, `missing fields`),
  postAddBoard,
);

boardsRouter.get("/:id", authorization, isValidId, getOneBoard);

boardsRouter.patch(
  "/:id",
  authorization,
  isValidId,
  validateBody(updateBoardSchema, `missing fields`),
  updateBoard,
);

boardsRouter.delete("/:id", authorization, isValidId, deleteBoard);

export default boardsRouter;
