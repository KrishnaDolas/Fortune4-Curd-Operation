const express = require("express");
const router = express.Router();
const auth = require("../Middleware/authMiddleware");

const {
  addRecipe,
  getRecipes,
  getRecipe,
  deleteRecipe,
} = require("../Controllers/recipeController");

router.post("/add", auth, addRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.delete("/:id", auth, deleteRecipe);

module.exports = router;
