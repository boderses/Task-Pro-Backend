import { model, Schema } from "mongoose";
import { themeTypes } from "../constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    avatarURL: {
      type: String,
      default: "",
    },
    boards: {
      type: [
        {
          boardsId: {
            type: Schema.Types.ObjectId,
            ref: "board",
          },
          title: String,
          icon: String,
        },
      ],
      default: [],
    },
    theme: {
      type: String,
      enum: themeTypes,
      default: "dark",
    },
    token: String,
  },
  { versionKey: false, timestamps: true },
);

export const User = model("User", userSchema);
