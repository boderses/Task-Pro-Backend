import catchAsync from "../helpers/catchAsync.js";
import { addColumn, upColumn, delColumn } from "../services/columnService.js";
import HttpError from "../helpers/HttpError.js";
import { isDuplicateCreate } from "../helpers/isDuplicateCreate.js";
import { isDuplicateUpdate } from "../helpers/isDuplicateUpdate.js";
import { Board } from "../models/boardModel.js";
import { Column } from "../models/columnModel.js";

export const postColumn = catchAsync(async (req, res) => {
  const { board: boardId } = req.body;
  const isColumnExist = await isDuplicateCreate("columns", Board, boardId, req);

  if (isColumnExist) {
    throw HttpError(409, `Board ${req.body.title} already exist`);
  }

  const result = await addColumn(req);
  
  if (!result) {
    throw HttpError(404);
  }

  const { _id, title, updatedAt, board, tasks } = result;
  res.status(201).json({ _id, title, updatedAt, board, tasks });
});

export const updateColumn = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { _id: user } = req.user;
  const { board: boardId } = req.body;

  const checkColumnId = await Column.findById(id);

  if (!checkColumnId || checkColumnId.user.toString() !== user.toString()) {
    throw HttpError(404);
  }

  const isColumnExist = await isDuplicateUpdate("columns", Board, boardId, req);
  
  if (isColumnExist) {
    throw HttpError(409, `Column ${req.body.title} already exist`);
  }

  const result = await upColumn(id, req);

  const { _id, title, updatedAt, board } = result;
  res.status(200).json({ _id, title, updatedAt, board });
});

export const deleteColumn = catchAsync(async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;

  const checkColumnId = await Column.findById(id);
  
  if (!checkColumnId || checkColumnId.user.toString() !== user.toString()) {
    throw HttpError(404);
  }

  const result = await delColumn(id);

  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json({ id, message: "Column deleted" });
});
