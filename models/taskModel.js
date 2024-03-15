import { model, Schema } from "mongoose";
import { priorityTypes } from "../constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for task"],
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: priorityTypes,
      default: "Without",
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    column: {
      type: Schema.Types.ObjectId,
      ref: "column",
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const Task = model("task", taskSchema);
