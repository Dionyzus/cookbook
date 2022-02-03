import express from "express";

const homeRouter = express.Router();

homeRouter.get("/", function (req, res) {
  res.send("Cookbook homepage");
});

homeRouter.get("/about", function (req, res) {
  res.send("About this cookbook");
});

export default homeRouter;