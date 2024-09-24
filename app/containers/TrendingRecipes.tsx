"use client";
import React, { useState } from "react";
import Image from "next/image";
import { RecipeProps } from "../types";
import { RecipeDetails } from "../components";

interface TrendingRecipesProps {
  recipes: RecipeProps[];
}

const TrendingRecipes: React.FC<TrendingRecipesProps> = ({ recipes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(
    null
  );

  const openModal = (recipe: RecipeProps) => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedRecipe(null);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-10 padding-y padding-x max-width">
      <div className="flex gap-1">
        <h2 className="big-text">Trending Recipes</h2>
        <Image src="/trending.svg" alt="Trending icon" width={50} height={50} />
      </div>
      <div className="recipe-container">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => openModal(recipe)}
            className="recipe-item"
          >
            <Image
              src={recipe.image}
              alt={recipe.recipe}
              width={200}
              height={112.5}
              className="recipe-image"
            />
            <h3 className="recipe-name">{recipe.recipe}</h3>
            <p className="recipe-text">
              {recipe.cook_time_in_minutes === 0 ? "Prep time" : "Cooking time"}
              :{" "}
              <span className="text-grey">
                {recipe.cook_time_in_minutes === 0
                  ? recipe.prep_time_in_minutes
                  : recipe.cook_time_in_minutes}{" "}
                min
              </span>
            </p>
            <p className="recipe-text">
              Calories:{" "}
              <span className="text-grey">{recipe.calories} kcal</span>{" "}
            </p>
            {selectedRecipe && (
              <RecipeDetails
                isOpen={isOpen}
                closeModal={closeModal}
                recipe={selectedRecipe}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRecipes;
