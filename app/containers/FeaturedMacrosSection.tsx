"use client";
import React from "react";

import { RecipeCard } from "@/app/components";
import { useRecipeStore } from "../store/recipeStore";
import { RecipeProps } from "../types";

const FeaturedMacrosSection = () => {
  const recipes = useRecipeStore((state) => state.recipes);

  const highProteinRecipes = recipes
    .filter(
      (recipe: RecipeProps) =>
        recipe.protein_in_grams > 20 && recipe.protein_in_grams < 50
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-x padding-y max-width">
      <h2 className="big-text">Power Up: High-Protein Keto Recipes</h2>

      <div className="recipe-container">
        {highProteinRecipes.map((recipe) => {
          return <RecipeCard key={recipe.id} recipe={recipe} />;
        })}
      </div>
    </div>
  );
};

export default FeaturedMacrosSection;
