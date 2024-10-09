"use client";
import React from "react";
import Image from "next/image";
import { RecipeProps } from "@/app/types";
import { RecipeCard } from "@/app/components";

interface TrendingRecipesProps {
  recipes: RecipeProps[];
}

const TrendingRecipes: React.FC<TrendingRecipesProps> = ({ recipes }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image src="/trending.svg" alt="Trending icon" width={50} height={50} />
      </div>
      <div className="recipe-container">
        {recipes.map((recipe) => {
          return <RecipeCard key={recipe.id} recipe={recipe} />;
        })}
      </div>
    </div>
  );
};

export default TrendingRecipes;
