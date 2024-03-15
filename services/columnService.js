import { Column } from "../models/columnModel.js";
import { Board } from "../models/boardModel.js";
import {
  Task
} from "../models/taskModel.js";

async function addColumn(req) {
  const { _id: user } = req.user;
  const { board: boardId } = req.body;
  const result = await Column.create({ ...req.body, user });

  await Board.findByIdAndUpdate(
    boardId,
    {
      $push: { columns: result._id },
    },
    { new: true },
  );

  return result;
}

async function upColumn(id, req) {
  const result = await Column.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  return result;
}

async function delColumn(id) {
  await Task.deleteMany({ column: id });

  const result = await Column.findByIdAndDelete(id);

  await Board.findByIdAndUpdate(
    result.board,
    {
      $pull: { columns: result._id },
    },
    { new: true },
  );

  return result;
}

export { addColumn, upColumn, delColumn };
