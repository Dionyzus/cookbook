const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe");

/**
 * @api {get} /api/recipes/:id Get recipe
 * @apiName GetRecipe
 * @apiGroup Recipes
 *
 * @apiParam {Number} id Recipe unique ID.
 */
router.get("/:id", recipeController.getItem);

/**
 * @api {get} /api/recipes/ Get recipes
 * @apiName GetRecipes
 * @apiGroup Recipes
 *
 * @apiParam {String} key Search field [name/ingredient]
 * @apiParam {String} value Search value
 * @apiParam {Number} page Pagination page
 * @apiParam {Number} limit Pagination limit
 */
router.get("/", recipeController.getCollection);

/**
 * @api {put} /api/recipes/:id Edit recipe
 * @apiName UpdateRecipe
 * @apiGroup Recipes
 *
 * @apiParam {Number} id Recipe unique ID.
 */
router.put("/:id", recipeController.updateItem);

/**
 * @api {post} /api/recipes/ Create recipe
 * @apiName CreateRecipe
 * @apiGroup Recipes
 */
router.post("/", recipeController.saveItem);

/**
 * @api {delete} /api/recipes/:id Delete recipe
 * @apiName DeleteRecipe
 * @apiGroup Recipes
 *
 * @apiParam {Number} id Recipe unique ID.
 */
router.delete("/:id", recipeController.removeItem);

module.exports = router;
