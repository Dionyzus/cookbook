const request = require("supertest");
const { app, db, dbConnection } = require("../server");

beforeAll((done) => {
  done();
});

afterAll((done) => {
  dbConnection.close(() => {
    db.disconnect(() => done());
  });
});

const recipe = {
  name: "Sugar cake",
  ingredients: [
    {
      ingredient: "Sugar",
      amount: {
        value: 100,
        unit: "g",
      },
    },
  ],
  description: "This is very sweet cake",
};

const newRecipe = {
  name: "Bad cake",
  ingredients: [
    {
      ingredient: "Very bad",
      amount: {
        value: 100,
        unit: "g",
      },
    },
  ],
  description: "This is very bad cake",
};

const updatedRecipe = {
  name: "Salt pie",
  ingredients: [
    {
      ingredient: "Salt",
      amount: {
        value: 50,
        unit: "g",
      },
    },
  ],
  description: "Not as salty pie",
};

//add patch route
const partialRecipeUpdate = {
  description: "Updated description for a recipe",
};

let recipeId = null;
let newRecipeId = null;

describe("Post Endpoint", () => {
  it("should create a new recipe", async () => {
    const res = await request(app).post("/api/recipes").send(recipe);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("ingredients");
    expect(res.body).toHaveProperty("description");
    expect(res.body.name).toEqual(recipe.name);
    expect(res.body.ingredients.ingredient).toEqual(
      recipe.ingredients.ingredient
    );
    expect(res.body.ingredients.amount).toEqual(recipe.ingredients.amount);
    expect(res.body.description).toEqual(recipe.description);

    recipeId = res.body._id;
  });
});

describe("Get Endpoints", () => {
  it("should get a all recipes", async () => {
    const res = await request(app).get("/api/recipes");

    expect(res.statusCode).toEqual(200);
    res.body.collection.forEach((el) => {
      if (el._id === recipeId) {
        expect(el).toHaveProperty("name");
        expect(el).toHaveProperty("ingredients");
        expect(el).toHaveProperty("description");
        expect(el.name).toEqual(recipe.name);
        expect(el.ingredients.ingredient).toEqual(
          recipe.ingredients.ingredient
        );
        expect(el.ingredients.amount).toEqual(recipe.ingredients.amount);
        expect(el.description).toEqual(recipe.description);
      }
    });

    recipeCount = res.body.length;
  });

  it("should get a recipe by id", async () => {
    const res = await request(app).get(`/api/recipes/${recipeId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("ingredients");
    expect(res.body).toHaveProperty("description");
    expect(res.body.name).toEqual(recipe.name);
    expect(res.body.ingredients.ingredient).toEqual(
      recipe.ingredients.ingredient
    );
    expect(res.body.ingredients.amount).toEqual(recipe.ingredients.amount);
    expect(res.body.description).toEqual(recipe.description);
  });

  it("should search a recipe by name", async () => {
    const res = await request(app).get("/api/recipes").query({
      key: "name",
      value: recipe.name,
    });

    expect(res.statusCode).toEqual(200);
    res.body.collection.forEach((el) => {
      if (el._id === recipeId) {
        expect(el).toHaveProperty("name");
        expect(el).toHaveProperty("ingredients");
        expect(el).toHaveProperty("description");
        expect(el.name).toEqual(recipe.name);
        expect(el.ingredients.ingredient).toEqual(
          recipe.ingredients.ingredient
        );
        expect(el.ingredients.amount).toEqual(recipe.ingredients.amount);
        expect(el.description).toEqual(recipe.description);
      }
    });
  });

  it("should search a recipe by ingredient", async () => {
    const res = await request(app).get("/api/recipes").query({
      key: "ingredient",
      value: recipe.ingredients[0].ingredient,
    });

    expect(res.statusCode).toEqual(200);
    res.body.collection.forEach((el) => {
      if (el._id === recipeId) {
        expect(el).toHaveProperty("name");
        expect(el).toHaveProperty("ingredients");
        expect(el).toHaveProperty("description");
        expect(el.name).toEqual(recipe.name);
        expect(el.ingredients.ingredient).toEqual(
          recipe.ingredients.ingredient
        );
        expect(el.ingredients.amount).toEqual(recipe.ingredients.amount);
        expect(el.description).toEqual(recipe.description);
      }
    });
  });

  it("should get paginated recipes", async () => {
    const postRes = await request(app).post("/api/recipes").send(newRecipe);
    newRecipeId = postRes.body._id;

    const res = await request(app).get("/api/recipes").query({
      offset: 0,
      limit: 1,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.collection.length).toEqual(1);
  });
});

describe("Put Endpoint", () => {
  it("should edit a recipe", async () => {
    const res = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send(updatedRecipe);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("ingredients");
    expect(res.body).toHaveProperty("description");
    expect(res.body.name).toEqual(updatedRecipe.name);
    expect(res.body.ingredients.ingredient).toEqual(
      updatedRecipe.ingredients.ingredient
    );
    expect(res.body.ingredients.amount).toEqual(
      updatedRecipe.ingredients.amount
    );
    expect(res.body.description).toEqual(updatedRecipe.description);
  });
});

describe("Delete Endpoint", () => {
  it("should delete a recipe", async () => {
    const res = await request(app).delete(`/api/recipes/${recipeId}`);
    expect(res.statusCode).toEqual(204);
    expect(res.body).toMatchObject({});

    //remove other recipe as well
    await request(app).delete(`/api/recipes/${newRecipeId}`);
  });
});
