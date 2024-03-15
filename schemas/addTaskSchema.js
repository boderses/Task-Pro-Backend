import Joi from "joi";
import { priorityTypes } from "../constants.js";

export const addTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  description: Joi.string(),
  priority: Joi.string().valid(...priorityTypes),
  deadline: Joi.date(),
  column: Joi.string().required().messages({
    "any.required": "missing required column field",
  }),
});
