import catchAsync from "../helpers/catchAsync.js";
import { signup, login, updateUserProfile } from "../services/usersServices.js";
import { User } from "../models/userModel.js";

import sendEmail from "../helpers/sendEmail.js";

export const registerUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const { token, user } = await signup(userData);

  res.status(201).json({
    token,
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      boards: user.boards,
      theme: user.theme,
    },
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await login(email, password);
  res.status(201).json({ user });
});

export const getCurrentUser = async (req, res) => {
  const { _id, name, email, avatarURL, boards, theme } = req.user;

  await User.findById(_id, { new: true })
    .populate("boards", {
      _id: 1,
      title: 1,
      icon: 1,
      background: 1,
      updatedAt: 1,
    })
    .then((user) => {
      res.status(201).json({
        user: {
          name,
          email,
          avatarURL,
          boards,
          theme,
        },
      });
    });
};

export const logoutUser = catchAsync(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
});

export const emailSupport = catchAsync(async (req, res) => {
  const { email, comment } = req.body;

  const helpRequest = {
    to: "taskpro.project@gmail.com",
    subject: "User need help.",
    html: `<p> Email: ${email}, Comment: ${comment}</p>`,
  };
  await sendEmail(helpRequest);
  const helpResponse = {
    to: email,
    subject: "Support",
    html: `<p>Thank's for your request! We will review your comment as soon as possible!</p>`,
  };
  await sendEmail(helpResponse);

  res.json({
    message: "Reply email has been sent",
  });
});

export const updateTheme = catchAsync(async (req, res) => {
  try {
    const { _id } = req.user;
    const { theme } = req.body;

    await User.findByIdAndUpdate(_id, req.body);
    res.json({
      theme,
      message: `The theme has been changed.`,
    });
  } catch (error) {
    next(error);
  }
});

export const updateUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
 
  const updatedUser = await updateUserProfile(_id, req.body, req.file);
  
  res.json({
    message: "Profile updated",
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      theme: updatedUser.theme,
      avatarURL: updatedUser.avatarURL
    },
  });
});
