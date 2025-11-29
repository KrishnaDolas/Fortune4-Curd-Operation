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
        Authorization: token,
      };

      console.log("Sending POST to:", `${import.meta.env.VITE_API_URL}/add`);
      console.log("Authorization header:", headers.Authorization);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/add`,
        payload,
        {
          headers,
          timeout: 15000,
        }
      );

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

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-emerald-50 flex items-start justify-center px-4 py-10">
      <div className="relative w-full max-w-3xl">
        {/* Glow background */}
        <div className="pointer-events-none absolute -inset-6 bg-gradient-to-tr from-amber-200/70 via-rose-300/50 to-emerald-200/60 blur-3xl opacity-60" />

        {/* Glass card */}
        <div className="relative rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/70 px-5 py-7 sm:px-8 sm:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Share your recipe
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Add new recipe
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Fill in the details to publish your next signature dish.
              </p>
            </div>

            {/* Auth status pill */}
            {/* <div className="mt-1 sm:mt-0">
              {storedToken ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Authenticated – token found
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700 border border-red-100">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Not logged in – please login
                </span>
              )}
            </div> */}
          </div>

          {/* Form grid */}
          <div className="space-y-6">
            {/* Basic details */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Recipe title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Creamy Paneer Butter Masala"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                />
                {errors.title && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Rating + Time */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Rating (0–5)
                  </label>
                  <input
                    type="number"
                    placeholder="4.5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  {errors.rating && (
                    <p className="text-[11px] text-red-600 mt-1">
                      {errors.rating}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Time to prepare
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30 mins"
                    value={timeToPrepare}
                    onChange={(e) => setTimeToPrepare(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                  />
                  {errors.timeToPrepare && (
                    <p className="text-[11px] text-red-600 mt-1">
                      {errors.timeToPrepare}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Description
              </label>
              <textarea
                placeholder="Describe the dish, flavour and any tips for best results..."
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner min-h-[90px]"
              />
              {errors.discription && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.discription}
                </p>
              )}
            </div>

            {/* Image upload + preview */}
            <div className="grid gap-4 md:grid-cols-[1.3fr,minmax(0,1fr)]">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Recipe image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageToBase64}
                  className="w-full rounded-2xl border border-dashed border-slate-300 bg-white/70 px-3 py-2.5 text-sm text-slate-900 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-emerald-600"
                />
                {errors.image && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {errors.image}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-slate-500">
                  Use a clear, appetizing image to attract more views.
                </p>
              </div>

              <div className="flex items-center justify-center">
                {imageBase64 ? (
                  <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-2xl border border-white/60 bg-slate-100 shadow-inner">
                    <img
                      src={imageBase64}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-full max-w-xs items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-[11px] text-slate-500">
                    Image preview will appear here
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">
                  Ingredients
                </h3>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  + Add ingredient
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                List every ingredient with quantity, one per line.
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Ingredient ${idx + 1}`}
                      value={ing}
                      onChange={(e) => updateIngredient(idx, e.target.value)}
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {errors.ingredients && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.ingredients}
                </p>
              )}
            </div>

            {/* Directions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">
                  Directions
                </h3>
                <button
                  type="button"
                  onClick={addDirection}
                  className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors"
                >
                  + Add step
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Add each step clearly so anyone can follow your recipe.
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {directions.map((d, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Step ${idx + 1}`}
                      value={d}
                      onChange={(e) => updateDirection(idx, e.target.value)}
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeDirection(idx)}
                      className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {errors.directions && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.directions}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="button"
                onClick={submitRecipe}
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/60 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Submitting..." : "Publish recipe"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
