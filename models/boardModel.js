import { model, Schema } from "mongoose";
import { iconTypes, backgroundTypes } from "../constants.js";

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for board"],
    },
    icon: {
      type: String,
      enum: iconTypes,
      default: "mark-circuls-18",
    },
    background: {
      type: String,
      enum: backgroundTypes,
      default: "00",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: "column",
      },
    ],
  },
  { versionKey: false, timestamps: true },
);

export const Board = model("board", boardSchema);
