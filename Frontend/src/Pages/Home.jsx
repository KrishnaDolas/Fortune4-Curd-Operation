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
        setRecipes(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError(
          err?.response?.data?.message || err.message || "Failed to fetch recipes"
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-4">Loading recipes...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">All Recipes</h2>

      {Array.isArray(recipes) && recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id || recipe.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
            >
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-700 flex-1 mb-4">
                  {recipe.description || "No description available."}
                </p>

                <div className="text-sm text-gray-600 mb-1">
                  <strong>Rating:</strong> {recipe.rating ?? "N/A"}
                </div>
                {recipe.timeToPrepare && (
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>Time:</strong> {recipe.timeToPrepare}
                  </div>
                )}
                {recipe.user && (
                  <div className="text-xs text-gray-500 mt-auto">
                    By: {recipe.user.name} ({recipe.user.email})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">No recipes found</div>
      )}
    </div>
  );
}
