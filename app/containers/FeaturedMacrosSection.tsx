"use client";
import React, { useState } from "react";

import { RecipeProps } from "@/app/types";
import { RecipeCard } from "@/app/components";

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
        {highProteinRecipes.map((recipe) => {
          return <RecipeCard key={recipe.id} recipe={recipe} />;
        })}
      </div>
    </div>
  );
};

export default FeaturedMacrosSection;
