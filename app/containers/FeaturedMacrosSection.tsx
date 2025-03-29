"use client";
import React from "react";
import { RecipeProps } from "@/app/types";
import { RecipeCard } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const FeaturedMacrosSection = () => {
  const { data: recipes = [], isLoading } = useRecipes();

  // Get recipes with high protein content
  const highProteinRecipes = recipes
    .filter((recipe) => recipe.protein_in_grams > 20)
    .slice(0, 6);

  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-x padding-y max-width">
      <h2 className="big-text">Power Up: High-Protein Keto Recipes</h2>

      <div className="recipe-container">
        {isLoading
          ? // Show 6 skeletons while loading
            Array.from({ length: 6 }).map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))
          : highProteinRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
      </div>
    </div>
  );
};

export default FeaturedMacrosSection;
