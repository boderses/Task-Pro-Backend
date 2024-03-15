import Joi from "joi";

export const replaceTaskSchema = Joi.object({
  column: Joi.string().required().messages({
    "any.required": "missing required column field",
  }),
});
