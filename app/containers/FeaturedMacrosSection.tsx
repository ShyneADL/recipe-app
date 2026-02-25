"use client";
import React, { useMemo } from "react";
import { RecipeCard } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const FeaturedMacrosSection = () => {
  const { data: recipes = [], isLoading, isError, error } = useRecipes();

  // Memoize filtered & sliced result — avoid recomputing on every render
  const highProteinRecipes = useMemo(
    () => recipes.filter((r) => r.protein_in_grams > 20).slice(0, 6),
    [recipes],
  );

  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-x padding-y max-width">
      <h2 className="big-text">Power Up: High-Protein Keto Recipes</h2>

      <div className="recipe-container">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))
        ) : isError ? (
          <div className="text-center py-8 text-red-500 w-full">
            Failed to load high-protein recipes. {(error as Error)?.message}
          </div>
        ) : highProteinRecipes.length > 0 ? (
          highProteinRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 w-full">
            No high-protein recipes found.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedMacrosSection;
