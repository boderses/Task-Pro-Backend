import queryString from "querystring";
import axios from "axios";
// const { HttpError } = require("../../helpers");
import { User } from "../models/userModel.js";
import { Token } from "../models/tokenRefresh.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const {
  JWT_SECRET,
  REFRESH_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BASE_URL_FRONTEND,
} = process.env;

export const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search.substring(1));
  const code = urlParams.code;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `https://project-team-6-backend.onrender.com/users/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const { data: userData } = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    const hashPassword = await bcrypt.hash(userData.id, 10);
    await User.create({
      email: userData.email,
      name: userData.name,
      avatarURL: userData.picture,
      password: hashPassword,
    });
  }
  const userNew = await User.findOne({ email: userData.email });

  const userInTokensCollection = await Token.findOne({
    userEmail: userData.email,
  });

  if (userInTokensCollection) {
    await Token.findOneAndRemove({ userEmail: userData.email });
  }

  /* const newSession = await Session.create({
    uid: userNew._id,
  });

  const payload = {
    id: userNew._id,
    sid: newSession._id,
  }; */

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "11h" });
  const tokenRefresh = jwt.sign(payload, REFRESH_KEY, {
    expiresIn: "23d",
  });

  await User.findByIdAndUpdate(userNew._id, { token });

  await Token.create({
    userEmail: userNew.email,
    tokenRefresh,
  });

  return res.redirect(
    `${BASE_URL_FRONTEND}/welcome/?token=${token}&tokenRefresh=${tokenRefresh}`
  );
};

