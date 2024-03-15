import catchAsync from "../helpers/catchAsync.js";
import {
  addBoard,
  getBoard,
  upBoard,
  delBoard,
} from "../services/boardService.js";
import HttpError from "../helpers/HttpError.js";
import { isDuplicateCreate } from "../helpers/isDuplicateCreate.js";
import { isDuplicateUpdate } from "../helpers/isDuplicateUpdate.js";
import { User } from "../models/userModel.js";
import { Board } from "../models/boardModel.js";

export const postAddBoard = catchAsync(async (req, res) => {
  const { _id: user } = req.user;
  const isBoardExist = await isDuplicateCreate("boards", User, user, req);

  if (isBoardExist) {
    throw HttpError(409, `Board ${req.body.title} already exist`);
  }

  const result = await addBoard(req, user);

  if (!result) {
    throw HttpError(404);
  }

  const { _id, title, icon, background, columns, updatedAt } = result;
  res.status(201).json({ _id, title, icon, background, updatedAt, columns });
});

export const getOneBoard = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getBoard(id);

  if (!result) {
    throw HttpError(404);
  }

  const { _id, title, icon, background, columns, updatedAt } = result;
  res.status(200).json({ _id, title, icon, background, updatedAt, columns });
});

export const updateBoard = catchAsync(async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const checkBoardId = await Board.findById(id);

  if (!checkBoardId || checkBoardId.user.toString() !== user.toString()) {
    throw HttpError(404);
  }

  const isBoardExist = await isDuplicateUpdate("boards", User, user, req);
  
  if (isBoardExist) {
    throw HttpError(409, `Board ${req.body.title} already exist`);
  }

  const result = await upBoard(id, req);

  if (!result.resBoard) {
    throw HttpError(404);
  }

  const { _id, title, icon, background, updatedAt } = result.resBoard;
  res.status(200).json({ _id, title, icon, background, updatedAt });
});

export const deleteBoard = catchAsync(async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const checkBoardId = await Board.findById(id);

  if (!checkBoardId || checkBoardId.user.toString() !== user.toString()) {
    throw HttpError(404);
  }

  const result = await delBoard(id, req);
  
  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json({ id, message: "Board deleted" });
});
