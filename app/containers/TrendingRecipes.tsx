"use client";
import React from "react";
import Image from "next/image";
import { RecipeCard } from "@/app/components";
import { useRecipeStore } from "../store/recipeStore";

const TrendingRecipes = () => {
  const recipes = useRecipeStore((state) => state.recipes);

  const slicedRecipes = [...recipes]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image src="/trending.svg" alt="Trending icon" width={50} height={50} />
      </div>
      <div className="recipe-container">
        {slicedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default TrendingRecipes;
