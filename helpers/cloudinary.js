import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const { CLOUD_NAME, KEY_CLOUDINARY, SECRET_CLOUDINARY } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: KEY_CLOUDINARY,
  api_secret: SECRET_CLOUDINARY,
});

export default cloudinary;
