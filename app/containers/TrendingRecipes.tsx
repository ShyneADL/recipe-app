"use client";
import React from "react";

import { RecipeCard } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";
import Image from "next/image";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const TrendingRecipes = () => {
  const { data: recipes = [], isLoading } = useRecipes();

  // Get the first 6 recipes for trending section
  const trendingRecipes = recipes.slice(0, 6);

  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image src="/trending.svg" alt="Trending icon" width={50} height={50} />
      </div>
      <div className="recipe-container">
        {isLoading
          ? // Show 6 skeletons while loading
            Array.from({ length: 6 }).map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))
          : trendingRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
      </div>
    </div>
  );
};

export default TrendingRecipes;
