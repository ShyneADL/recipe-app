"use client";
import React from "react";
import { RecipeCard } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";

const FeaturedMacrosSection = () => {
  const { data: recipes = [], isLoading } = useRecipes();

  if (isLoading) {
    return <div>Loading featured recipes...</div>;
  }

  // Get recipes with high protein content
  const highProteinRecipes = recipes
    .filter((recipe) => recipe.protein_in_grams > 20)
    .slice(0, 6);

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
