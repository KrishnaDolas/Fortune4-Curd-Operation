import { useState } from "react";
import axios from "axios";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [discription, setDiscription] = useState(""); // backend field spelling
  const [rating, setRating] = useState("");
  const [timeToPrepare, setTimeToPrepare] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [directions, setDirections] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const rawEnv = import.meta.env.VITE_API_URL;
  // const API_BASE = rawEnv.replace(/\/$/, "") + "/api/recipe";

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!discription.trim()) e.discription = "Description is required";
    const r = Number(rating);
    if (!rating || isNaN(r) || r < 0) e.rating = "Provide a valid rating";
    if (!timeToPrepare.trim()) e.timeToPrepare = "Time to prepare is required";
    if (!imageBase64) e.image = "Image is required";
    if (!ingredients.length || ingredients.some((i) => !i.trim()))
      e.ingredients = "All ingredient fields must be filled";
    if (!directions.length || directions.some((d) => !d.trim()))
      e.directions = "All direction fields must be filled";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageToBase64 = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result);
    reader.onerror = () =>
      setErrors((prev) => ({ ...prev, image: "Failed to read image file" }));
    reader.readAsDataURL(file);
  };

  const addIngredient = () => setIngredients((p) => [...p, ""]);
  const addDirection = () => setDirections((p) => [...p, ""]);

  const updateIngredient = (index, value) =>
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });

  const updateDirection = (index, value) =>
    setDirections((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });

  const removeIngredient = (index) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  const removeDirection = (index) =>
    setDirections((prev) => prev.filter((_, i) => i !== index));

  const submitRecipe = async () => {
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert(
        "You must be logged in to add a recipe.\nNo token found in localStorage."
      );
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      discription: discription.trim(), // exact backend field
      rating: Number(rating),
      timeToPrepare: timeToPrepare.trim(),
      image: imageBase64,
      ingredients: ingredients.map((i) => i.trim()),
      directions: directions.map((d) => d.trim()),
    };

    try {
      const headers = {
        "Content-Type": "application/json",
        // middleware: const token = req.header('Authorization'); → raw token needed
        Authorization: token,
      };

      console.log("Sending POST to:", `${import.meta.env.VITE_API_URL}/add`);
      console.log("Authorization header:", headers.Authorization);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/add`, payload, {
        headers,
        timeout: 15000,
      });

      if (res?.status === 201 || res?.status === 200) {
        alert("Recipe added successfully");
        setTitle("");
        setDiscription("");
        setRating("");
        setTimeToPrepare("");
        setImageBase64("");
        setIngredients([""]);
        setDirections([""]);
        setErrors({});
      } else {
        const errMsg = res?.data?.message || "Unexpected response from server";
        alert(errMsg);
      }
    } catch (err) {
      console.error("Add recipe error:", err);
      console.error("Status:", err?.response?.status);
      console.error("Response data:", err?.response?.data);

      if (
        err?.code === "ERR_NETWORK" ||
        err?.message?.toLowerCase().includes("network error")
      ) {
        alert(
          "Network Error: Could not reach backend.\n" +
            "Check that the backend is running and VITE_API_URL is correct."
        );
      } else if (err?.response) {
        const serverMsg =
          err.response.data?.message ||
          JSON.stringify(err.response.data) ||
          err.message;
        alert(
          `Server error (status ${err.response.status}): ` + serverMsg
        );
      } else {
        alert(err.message || "Failed to add recipe");
      }
    } finally {
      setLoading(false);
    }
  };

  const storedToken = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Recipe</h2>

      {/* Small info bar about auth status */}
      <div className="mb-4 text-sm">
        {/* <span className="font-semibold">Auth status:</span>{" "} */}
        {storedToken ? (
          <span className="text-green-600">Token found in localStorage</span>
        ) : (
          <span className="text-red-600">
            No token found. Please login first.
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.title && (
            <div className="text-red-600 text-sm">{errors.title}</div>
          )}
        </div>

        {/* Description / discription */}
        <div>
          <textarea
            placeholder="Description"
            value={discription}
            onChange={(e) => setDiscription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />
          {errors.discription && (
            <div className="text-red-600 text-sm">{errors.discription}</div>
          )}
        </div>

        {/* Rating */}
        <div>
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
            max="5"
          />
          {errors.rating && (
            <div className="text-red-600 text-sm">{errors.rating}</div>
          )}
        </div>

        {/* Time to prepare */}
        <div>
          <input
            type="text"
            placeholder="Time to Prepare (e.g., 30 mins)"
            value={timeToPrepare}
            onChange={(e) => setTimeToPrepare(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.timeToPrepare && (
            <div className="text-red-600 text-sm">
              {errors.timeToPrepare}
            </div>
          )}
        </div>

        {/* Image */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageToBase64}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.image && (
            <div className="text-red-600 text-sm">{errors.image}</div>
          )}
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="preview"
              className="mt-2 max-h-40 object-contain"
            />
          )}
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={`Ingredient ${idx + 1}`}
                value={ing}
                onChange={(e) => updateIngredient(idx, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="px-3 bg-red-500 text-white rounded"
              >
                X
              </button>
            </div>
          ))}
          {errors.ingredients && (
            <div className="text-red-600 text-sm">{errors.ingredients}</div>
          )}
          <button
            type="button"
            onClick={addIngredient}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Ingredient
          </button>
        </div>

        {/* Directions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Directions</h3>
          {directions.map((d, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={`Direction ${idx + 1}`}
                value={d}
                onChange={(e) => updateDirection(idx, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => removeDirection(idx)}
                className="px-3 bg-red-500 text-white rounded"
              >
                X
              </button>
            </div>
          ))}
          {errors.directions && (
            <div className="text-red-600 text-sm">{errors.directions}</div>
          )}
          <button
            type="button"
            onClick={addDirection}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Direction
          </button>
        </div>

        {/* Submit */}
        <div>
          <button
            type="button"
            onClick={submitRecipe}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Recipe"}
          </button>
        </div>
      </div>
    </div>
  );
}
