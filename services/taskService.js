import { Column } from "../models/columnModel.js";
import { Task } from "../models/taskModel.js";

async function addTask(req) {
  const { _id: user } = req.user;
  const { column } = req.body;
  const checkColumn = await Column.findById(column);
  if (!checkColumn) return null;

  const result = await Task.create({ ...req.body, user });

  await Column.findByIdAndUpdate(
    column,
    {
      $push: { tasks: result._id },
    },
    { new: true },
  );

  return result;
}

async function delTask(req) {
  const { _id: user } = req.user;
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task || task.user.toString() !== user.toString()) return null;

  await Column.updateOne({ _id: task.column }, { $pull: { tasks: id } });

  const result = await Task.findByIdAndDelete(id);

  return result;
}

async function upTask(req) {
  const { _id: user } = req.user;
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task || task.user.toString() !== user.toString()) return null;

  const result = await Task.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) return null;

  return result;
}

async function moveTask(req) {
  const { id } = req.params;
  const { column: toColumnId } = req.body;

  const task = await Task.findById(id);
  if (!task) return null;

  const toColumn = await Column.findById(toColumnId);
  if (!toColumn) return null;

  const fromColumn = await Column.findOne({ tasks: id });
  if (!fromColumn) return null;

  fromColumn.tasks.pull(id);
  await fromColumn.save();

  task.column = toColumnId;
  await task.save();

  toColumn.tasks.push(task._id);
  await toColumn.save();

  return true;
}
export { addTask, delTask, upTask, moveTask };
