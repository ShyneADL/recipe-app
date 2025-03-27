"use client";
import React from "react";
import { RecipeProps } from "@/app/types";
import { RecipeCard } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";
import Image from "next/image";

const TrendingRecipes = () => {
  const { data: recipes = [], isLoading } = useRecipes();

  if (isLoading) {
    return <div>Loading trending recipes...</div>;
  }

  const trendingRecipes = recipes.slice(0, 6);

  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image src="/trending.svg" alt="Trending icon" width={50} height={50} />
      </div>
      <div className="recipe-container">
        {trendingRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default TrendingRecipes;
