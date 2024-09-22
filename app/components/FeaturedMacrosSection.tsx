"use client";
import React from "react";
import Image from "next/image";
import { RecipeProps } from "../types";

interface FeaturedMacrosSectionProps {
  highProteinRecipes: RecipeProps[];
}

const FeaturedMacrosSection: React.FC<FeaturedMacrosSectionProps> = ({
  highProteinRecipes,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 padding-x padding-y max-width">
      <h2 className="big-text">Power Up: High-Protein Keto Recipes</h2>

      <div className="recipe-container">
        {highProteinRecipes.map((recipe) => (
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
              Protein:{" "}
              <span className="text-grey">{recipe.protein_in_grams} g</span>
            </p>
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

export default FeaturedMacrosSection;
