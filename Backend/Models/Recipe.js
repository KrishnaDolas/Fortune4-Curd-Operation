const mongoose = require("mongoose");
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discription: { type: String, required: true },
  rating: { type: Number, required: true },
  timeToPrepare: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: { type: Array, required: true },
  directions: {type: Array, required: true },
  user : { type: mongoose.Schema.Types.ObjectId,ref:'User' },
});

module.exports = mongoose.model("Recipe", recipeSchema);