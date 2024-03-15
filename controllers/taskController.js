import catchAsync from "../helpers/catchAsync.js";
import HttpError from "../helpers/HttpError.js";
import { addTask, delTask, upTask, moveTask } from "../services/taskService.js";

export const postTask = catchAsync(async (req, res) => {
  const { column } = req.body;
  const columnId = column;
  const result = await addTask(req);
  
  if (!result) {
    throw HttpError(404);
  }

  const { _id, title, description, priority, deadline, updatedAt } = result;
  res
    .status(201)
    .json({ _id, title, description, priority, deadline, updatedAt, columnId });
});

export const deleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await delTask(req);
  
  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json({ _id: id, message: "Task deleted" });
});

export const updateTask = catchAsync(async (req, res) => {
  const result = await upTask(req);
  
  if (!result) {
    throw HttpError(404);
  }

  const { _id, title, description, priority, deadline, updatedAt } = result;
  res
    .status(200)
    .json({ _id, title, description, priority, deadline, updatedAt });
});

export const replaceTask = catchAsync(async (req, res) => {
  const result = await moveTask(req);
  
  if (!result) {
    throw HttpError(404);
  }

  res.status(200).json({ message: "Task replaced" });
});
