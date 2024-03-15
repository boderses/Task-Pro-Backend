import { model, Schema } from "mongoose";

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for column"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "board",
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "task",
      },
    ],
  },
  { versionKey: false, timestamps: true },
);

export const Column = model("column", columnSchema);
