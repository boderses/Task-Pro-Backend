import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

export const tokenRefreshSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: [true, "userId field, must be filled in correctly"],
    },
    tokenRefresh: {
      type: String,
      required: [true, "tokenRefresh field, must be filled in correctly"],
    },
  },
  { versionKey: false, timestamps: true }
);
tokenRefreshSchema.post("save", handleMongooseError);

export const Token = model("token", tokenRefreshSchema);

