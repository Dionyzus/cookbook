const {
  save,
  get,
  getAll,
  search,
  update,
  remove,
  patch,
} = require("../services/recipe/recipe");

const { getHttpStatusCode, HttpStatusCode } = require("../utils/errorUtils");
const { validateRequest } = require("../validations/recipe");

async function getItem(req, res) {
  try {
    const recipe = await get(req.params.id);
    res.status(HttpStatusCode.SUCCESS).json(recipe);
  } catch (error) {
    const code = getHttpStatusCode(error);
    res.status(code).json({ message: error.message });
  }
}

async function getCollection(req, res) {
  try {
    const recipeCollection = await getAll(req.query);
    res.status(HttpStatusCode.SUCCESS).json(recipeCollection);
  } catch (error) {
    const code = getHttpStatusCode(error);
    res.status(code).json({ message: error.message });
  }
}

async function queryCollection(req, res) {
  try {
    const recipeCollection = await search(req.query);
    res.status(HttpStatusCode.SUCCESS).json(recipeCollection);
  } catch (error) {
    const code = getHttpStatusCode(error);
    res.status(code).json({ message: error.message });
  }
}

async function updateItem(req, res) {
  const { error, value } = await validateRequest(req.body, "PUT");

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
}

async function patchItem(req, res) {
  const { error, value } = await validateRequest(req.body, "PATCH");

  if (error) {
    const code = getHttpStatusCode(error);
    res
      .status(code)
      .json({ message: "Invalid request data", data: error.message });
  } else {
    try {
      const recipe = await patch(req.params.id, value);
      res.status(HttpStatusCode.SUCCESS).json(recipe);
    } catch (error) {
      throw error;
    }
  }
}

async function saveItem(req, res) {
  const { error, value } = await validateRequest(req.body, "POST");

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
}

async function removeItem(req, res) {
  try {
    await remove(req.params.id);
    res
      .status(HttpStatusCode.NO_CONTENT)
      .send({ message: "Recipe deleted successfully" });
  } catch (error) {
    const code = getHttpStatusCode(error);
    res.status(code).json({ message: error.message });
  }
}

module.exports = {
  getItem,
  getCollection,
  queryCollection,
  updateItem,
  patchItem,
  saveItem,
  removeItem,
};
