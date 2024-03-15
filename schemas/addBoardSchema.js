import Joi from "joi";
import { iconTypes, backgroundTypes } from "../constants.js";

export const addBoardSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  icon: Joi.string().valid(...iconTypes),
  background: Joi.string().valid(...backgroundTypes),
});
