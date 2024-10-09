"use client";
import React, { useState } from "react";
import Image from "next/image";
import { getChefHatCount } from "../utils";
import { RecipeProps, RecipeDetailsProps } from "../types";
import RecipeDetails from "./RecipeDetails";

interface RecipeCardProps {
  recipe: RecipeProps;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
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
  const chefHatCount = getChefHatCount(recipe.difficulty); // Get chef hat count for each recipe

  return (
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
        Calories: <span className="text-grey">{recipe.calories} kcal</span>{" "}
      </p>

      <p className="recipe-text">
        {recipe.cook_time_in_minutes === 0 ? "Prep time" : "Cooking time"}:{" "}
        <span className="text-grey">
          {recipe.cook_time_in_minutes === 0
            ? recipe.prep_time_in_minutes
            : recipe.cook_time_in_minutes}{" "}
          min
        </span>
      </p>

      {/* Render Chef Hats Based on Difficulty */}
      <div className="flex items-center justify-between w-[175px]">
        <p className="recipe-text">Difficulty:</p>
        <div className="flex items-center justify-start gap-[6px] w-[100px]">
          {Array.from({ length: chefHatCount }).map((_, index) => (
            <Image
              key={index}
              src="/chef.png"
              alt="chef hat icon"
              width={25}
              height={25}
              className="chef-hat"
            />
          ))}
        </div>
      </div>

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <RecipeDetails
          isOpen={isOpen}
          closeModal={closeModal}
          recipe={selectedRecipe}
        />
      )}
    </div>
  );
};

export default RecipeCard;
