import { User } from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "../helpers/cloudinary.js";

dotenv.config();

const { JWT_SECRET } = process.env;

export const signup = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...userData, password: hashPassword });

  const { _id: id } = newUser;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await User.findByIdAndUpdate(id, { token }, { new: true });

  return { token, user: newUser };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await User.findByIdAndUpdate(user._id, { token }, { new: true }).populate(
    "boards",
    {
      _id: 1,
      title: 1,
      icon: 1,
      background: 1,
      updatedAt: 1,
    },
  );

  return {
    token,
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
    boards: user.boards,
    theme: user.theme,
  };
};

export const updateUserProfile = async (userId, reqBody, file) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw HttpError(404);
  }

  let hashPassword;
  if (reqBody.password) {
    hashPassword = await bcrypt.hash(reqBody.password, 10);
  }

  let avatarURL;
  
  if (file) {
    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      allowed_formats: ["jpg", "png"],
    });

    avatarURL = uploadedImage.url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...reqBody, password: hashPassword, avatarURL: avatarURL },
    { new: true },
  );

  if (!updatedUser) {
    throw HttpError(404);
  }

  return updatedUser;
};
