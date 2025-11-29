import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
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
        const data = Array.isArray(res.data) ? res.data : [];
        setRecipes(data);
        setFiltered(data);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError(
          (err &&
            err.response &&
            err.response.data &&
            err.response.data.message) ||
            err.message ||
            "Failed to fetch recipes"
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // simple client-side search
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(recipes);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      recipes.filter((r) =>
        [r.title, r.description, r.cuisine, r.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [search, recipes]);

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-emerald-50">
        <div className="w-full max-w-5xl px-6">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-amber-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Loading recipes
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Fetching tasty dishes for you...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-white/60 animate-pulse overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-r from-slate-200 to-slate-100" />
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
      </div>
    );
  }

  /* ---------- Error state ---------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 px-4">
        <div className="max-w-md w-full rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl border border-red-100 px-7 py-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>
          <h2 className="text-xl font-semibold text-red-700 mb-1">
            Something went wrong
          </h2>
          <p className="text-red-500 text-sm mb-4 break-words">
            {error}
          </p>
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

  /* ---------- Main UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-emerald-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top bar */}
        <div className="sticky top-4 z-20 mb-8">
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/70 px-5 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Curated by the community
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Discover delicious recipes
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Search, explore and get inspired for your next meal.
              </p>
            </div>

            {/* Search */}
            <div className="w-full sm:w-72">
              <label className="relative block">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, cuisine, category..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 shadow-sm">
            🍽️ <span className="ml-1 font-semibold">{filtered.length}</span>{" "}
            recipes
          </span>
          {search && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              Filtered by “{search}”
            </span>
          )}
        </div>

        {/* Recipes grid */}
        {Array.isArray(filtered) && filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((recipe) => (
              <article
                key={recipe._id || recipe.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/90 backdrop-blur-lg shadow-lg border border-white/70 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                {recipe.image ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                    {recipe.timeToPrepare && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow">
                        ⏱ {recipe.timeToPrepare}
                      </span>
                    )}
                    {recipe.rating != null && (
                      <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-amber-400/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow">
                        ⭐ {recipe.rating}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex h-44 w-full items-center justify-center bg-gradient-to-tr from-slate-100 via-slate-50 to-slate-200 text-slate-400 text-sm">
                    <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 bg-white/60">
                      No image provided
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-1.5 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {recipe.title}
                  </h3>

                  <p className="mb-3 flex-1 text-sm text-slate-600 line-clamp-3">
                    {recipe.description || "No description available."}
                  </p>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="space-x-2">
                      {recipe.cuisine && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                          {recipe.cuisine}
                        </span>
                      )}
                      {recipe.category && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                          {recipe.category}
                        </span>
                      )}
                    </div>
                    {recipe.servings && (
                      <span>
                        Serves{" "}
                        <span className="font-semibold">
                          {recipe.servings}
                        </span>
                      </span>
                    )}
                  </div>

                  {recipe.user && (
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-xs font-bold text-white shadow">
                        {(recipe.user.name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
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
