import Joi from "joi";
import { priorityTypes } from "../constants.js";

export const upTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  description: Joi.string().required().messages({
    "any.required": "missing required description field",
  }),
  priority: Joi.string()
    .required()
    .valid(...priorityTypes)
    .messages({
      "any.required": "missing required priority field",
    }),
  deadline: Joi.date().required().messages({
    "any.required": "missing required deadline field",
  }),
});
