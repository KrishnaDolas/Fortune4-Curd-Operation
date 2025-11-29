import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const API_BASE = `${import.meta.env.VITE_API_URL.replace(
      /\/$/,
      ""
    )}/api/recipe`;

    axios
      .get(API_BASE, { timeout: 10000 })
      .then((res) => {
        if (!mounted) return;
        setRecipes(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to fetch recipes"
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-rose-100 to-emerald-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 w-full max-w-6xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/60 backdrop-blur-lg shadow-lg border border-white/60 animate-pulse overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-100" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-200 rounded-md w-2/3" />
                <div className="h-4 bg-slate-200 rounded-md w-full" />
                <div className="h-4 bg-slate-200 rounded-md w-5/6" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                  <div className="h-4 bg-slate-200 rounded-md w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 px-4">
        <div className="max-w-md w-full rounded-2xl bg-white/70 backdrop-blur-lg shadow-xl border border-red-100 px-6 py-5 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-500 text-sm mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-red-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-700 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Discover & share recipes
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            All Recipes
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Browse delicious recipes shared by the community and find your next
            favourite dish for any occasion.
          </p>
        </header>

        {/* Recipes grid */}
        {Array.isArray(recipes) && recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <article
                key={recipe._id || recipe.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-white/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                {recipe.image ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                    {recipe.timeToPrepare && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
                        ⏱ {recipe.timeToPrepare}
                      </span>
                    )}
                    {recipe.rating != null && (
                      <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-amber-400/90 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow">
                        ⭐ {recipe.rating}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-tr from-slate-100 via-slate-50 to-slate-200 text-slate-400 text-sm">
                    <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 bg-white/60">
                      No image provided
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {recipe.title}
                  </h3>

                  <p className="mb-3 flex-1 text-sm text-slate-600 line-clamp-3">
                    {recipe.description || "No description available."}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <div className="space-x-2">
                      {recipe.cuisine && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                          {recipe.cuisine}
                        </span>
                      )}
                      {recipe.category && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          {recipe.category}
                        </span>
                      )}
                    </div>
                    {recipe.servings && (
                      <span className="text-[11px]">
                        Serves <span className="font-semibold">{recipe.servings}</span>
                      </span>
                    )}
                  </div>

                  {recipe.user && (
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-xs font-bold text-white">
                        {recipe.user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-800">
                          {recipe.user.name}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {recipe.user.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-inner">
              <span className="text-3xl">🍽️</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              No recipes yet
            </h2>
            <p className="text-sm text-slate-600 max-w-sm">
              It looks a bit empty here. Start by adding your first recipe and
              share your favourite dishes with others.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
