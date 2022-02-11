const express = require("express");
const app = express();

const recipeRouter = require("../src/routes/recipe");

app.use("/api/recipes", recipeRouter);

module.exports = {
  app,
};
