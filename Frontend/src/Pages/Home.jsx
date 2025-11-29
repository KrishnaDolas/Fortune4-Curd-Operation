import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const API_BASE = `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/recipe`;

    axios
      .get(API_BASE, { timeout: 10000 })
      .then((res) => {
        if (!mounted) return;
        console.log("Recipes response:", res.data); // debug the API response
        setRecipes(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("There was an error fetching the recipes!", err);
        console.error("Status:", err?.response?.status);
        console.error("Response data:", err?.response?.data);

        if (
          err?.code === "ERR_NETWORK" ||
          err?.message?.toLowerCase().includes("network error")
        ) {
          setError(
            "Network Error: Cannot reach backend. Make sure the backend is running and VITE_API_URL is correct."
          );
        } else {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to fetch recipes"
          );
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-4">Loading recipes...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Recipes</h2>

      {Array.isArray(recipes) && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe._id || recipe.id}
              className="border rounded p-4 shadow"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <p className="mb-2">{recipe.description}</p>
              <div className="text-sm text-gray-600">
                Rating: {recipe.rating ?? "N/A"}
              </div>
              {recipe.timeToPrepare && (
                <div className="text-sm text-gray-600">
                  Time: {recipe.timeToPrepare}
                </div>
              )}
              {recipe.user && (
                <div className="text-xs text-gray-500 mt-1">
                  By: {recipe.user.name} ({recipe.user.email})
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No recipes found</div>
      )}
    </div>
  );
}
