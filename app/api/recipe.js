import express from "express";
import { save, find, findAll, update, remove } from "../service/recipe";
import { getHttpStatusCode, HttpStatusCode } from "../util/errorUtil";
import { validateRequest } from "../validation/recipe";

const recipeRouter = express.Router();

recipeRouter.get("/", async (req, res) => {
  try {
    const recipeCollection = await findAll(req.query);
    res.status(HttpStatusCode.SUCCESS).json(recipeCollection);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

recipeRouter.post("/", async (req, res) => {
  const { error, value } = await validateRequest(req.body);

  if (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid request data",
      data: error.message,
    });
  } else {
    try {
      const recipe = await save(value);
      res.status(HttpStatusCode.CREATED).json(recipe);
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
});

recipeRouter.get("/:id", async (req, res) => {
  try {
    const recipe = await find(req.params.id);
    res.status(HttpStatusCode.SUCCESS).json(recipe);
  } catch (error) {
    const code = getHttpStatusCode(error);
    res.status(code).json({ message: error.message });
  }
});

recipeRouter.put("/:id", async (req, res) => {
  const { error, value } = await validateRequest(req.body);

  if (error) {
    const code = getHttpStatusCode(error);
    res
      .status(code)
      .json({ message: "Invalid request data", data: error.message });
  } else {
    try {
      const recipe = await update(req.params.id, value);
      res.status(HttpStatusCode.SUCCESS).json(recipe);
    } catch (error) {
      throw error;
    }
  }
});

recipeRouter.delete("/:id", async (req, res) => {
  try {
    await remove(req.params.id);
    res
      .status(HttpStatusCode.NO_CONTENT)
      .send({ message: "Recipe deleted successfully" });
  } catch (error) {
    const code = getHttpStatusCode(error);
    res.status(code).json({ message: error.message });
  }
});

export default recipeRouter;
