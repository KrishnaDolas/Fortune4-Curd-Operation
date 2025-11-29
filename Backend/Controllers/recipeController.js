// Controllers/recipeController.js
const Recipe = require("../Models/Recipe");

// Add Recipe
exports.addRecipe = async (req, res) => {
  try {
    const {
      title,
      discription,
      rating,
      timeToPrepare,
      image,
      ingredients,
      directions,
    } = req.body;

    const recipe = new Recipe({
      title,
      discription,
      rating,
      timeToPrepare,
      image,
      ingredients,
      directions,
      user: req.user.id,
    });

    await recipe.save();
    res.status(201).json({ message: "Recipe added successfully", recipe });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Get All Recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("user", ["name", "email"]);
    res.json(recipes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Get Single Recipe
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("user", [
      "name",
      "email",
    ]);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Delete Recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
