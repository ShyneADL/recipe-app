"use client";
import React, { useState } from "react";
import Image from "next/image";
import { RecipeProps } from "../types";
import { RecipeDetails } from "../components";

interface FeaturedMacrosSectionProps {
  highProteinRecipes: RecipeProps[];
}

const FeaturedMacrosSection: React.FC<FeaturedMacrosSectionProps> = ({
  highProteinRecipes,
}) => {
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
    <div className="flex flex-col items-center justify-center gap-10 padding-x padding-y max-width">
      <h2 className="big-text">Power Up: High-Protein Keto Recipes</h2>

      <div className="recipe-container">
        {highProteinRecipes.map((recipe) => (
          <div
            onClick={() => openModal(recipe)}
            key={recipe.id}
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
              Protein:{" "}
              <span className="text-grey">{recipe.protein_in_grams} g</span>
            </p>
            <p className="recipe-text">
              {recipe.cook_time_in_minutes === 0 ? "Prep time" : "Cooking time"}
              :{" "}
              <span className="text-grey">
                {recipe.cook_time_in_minutes === 0
                  ? recipe.cook_time_in_minutes
                  : recipe.prep_time_in_minutes}{" "}
                min
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Render the RecipeDetails modal only if selectedRecipe is set */}
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

export default FeaturedMacrosSection;