import React from "react";
import Image from "next/image";
import { RecipeProps } from "../types";

interface TrendingRecipesProps {
  recipes: RecipeProps[];
}

const TrendingRecipes: React.FC<TrendingRecipesProps> = ({ recipes }) => {
  return (
    <div className="flex flex-col items-center justify-center padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image src="/trending.svg" alt="Trending icon" width={50} height={50} />
      </div>
      <div className="recipe-container">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <Image
              src={recipe.image}
              alt={recipe.recipe}
              width={200}
              height={112.5}
              className="object-contain aspect-video rounded-xl"
            />
            <h3 className="recipe-name">{recipe.recipe}</h3>
            <p className="recipe-text">
              Cooking Time:{" "}
              <span className="text-grey">
                {recipe.cook_time_in_minutes} min
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRecipes;
