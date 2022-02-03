import express from "express";
import { save, find, findAll } from "../service/recipe";

const recipeRouter = express.Router();

recipeRouter.get("/", async function (req, res) {
  try {
    const recipeCollection = await findAll(req.query);
    res.status(200).json(recipeCollection);
  } catch (err) {
      //Custom server exception returned to the client?
    res.status(500).json({ error: err.message });
  }
});

recipeRouter.get("/:id", async function (req, res) {
  try {
    const recipe = await find(req.params.id);
    if (recipe != null) {
      res.status(200).json(recipe);
    } else {
      res
        .status(404)
        .json({ message: `Recipe with id: ${req.params.id} does not exist` });
    }
  } catch (err) {
      //Custom server exception returned to the client?
    res.status(500).json({ error: err.message });
  }
});

recipeRouter.post("/", async function (req, res) {
  try {
    const recipe = await save(req.body);
    res.status(201).json(recipe);
  } catch (err) {
    //Custom server exception returned to the client?
    res.status(500).json({ error: err.message });
  }
});

export default recipeRouter;
