import HttpError from "../helpers/HttpError.js";

export const isDuplicateCreate = async (collectionName, model, id, req) => {
  const result = await model.findById(id).populate({
    path: `${collectionName}`,
    select: {
      title: 1,
    },
  });
  if (!result) {
    throw HttpError(404, `boardId Not found`);
  }
  return result[collectionName].some((el) => el.title === req.body.title);
};
