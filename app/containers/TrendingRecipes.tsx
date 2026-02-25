"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { RecipeCard } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const TrendingRecipes = () => {
  const { data: recipes = [], isLoading, isError, error } = useRecipes();

  // Memoize the slice — no need to recompute on every render
  const trendingRecipes = useMemo(() => recipes.slice(0, 6), [recipes]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image
          src="/trending.svg"
          alt="Trending icon"
          width={50}
          height={50}
          // This icon is decorative and above-the-fold; prioritize it
          priority={false}
        />
      </div>
      <div className="recipe-container">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))
        ) : isError ? (
          <div className="text-center py-8 text-red-500 w-full">
            Failed to load trending recipes. {(error as Error)?.message}
          </div>
        ) : trendingRecipes.length > 0 ? (
          trendingRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 w-full">
            No trending recipes found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingRecipes;
