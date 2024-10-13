"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getChefHatCount } from "../utils";
import { RecipeProps, RecipeDetailsProps } from "../types";
import RecipeDetails from "./RecipeDetails";
import like_icon from "/public/like-icon.svg";
import like_icon_fill from "/public/like-icon-fill.svg";

interface RecipeCardProps {
  recipe: RecipeProps;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(
    null
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load wishlist state from localStorage on component mount
  useEffect(() => {
    const wishlistItems = localStorage.getItem("wishlist");
    if (wishlistItems) {
      const wishlist = JSON.parse(wishlistItems);
      setIsWishlisted(wishlist.includes(recipe.id));
    }
  }, [recipe.id]);

  const openModal = () => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedRecipe(null);
  };

  const calculateTotalTime = () => {
    if (
      recipe.cook_time_in_minutes === null &&
      recipe.prep_time_in_minutes === null
    ) {
      return 0;
    }
    return (
      (recipe.cook_time_in_minutes || 0) + (recipe.prep_time_in_minutes || 0)
    );
  };

  const chefHatCount = getChefHatCount(recipe.difficulty);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking wishlist icon

    // Update localStorage
    const wishlistItems = localStorage.getItem("wishlist");
    let wishlist: number[] = wishlistItems ? JSON.parse(wishlistItems) : [];

    if (isWishlisted) {
      wishlist = wishlist.filter((id) => id !== recipe.id);
    } else {
      wishlist.push(recipe.id);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div key={recipe.id} onClick={openModal} className="recipe-item">
      <Image
        src={recipe.image}
        alt={recipe.recipe}
        width={200}
        height={112.5}
        className="recipe-image"
      />
      <h3 className="recipe-name">{recipe.recipe}</h3>

      <p className="recipe-text">
        Calories: <span className="text-grey">{recipe.calories} kcal</span>
      </p>

      <p className="recipe-text">
        {recipe.cook_time_in_minutes === 0 ? "Prep time" : "Cooking time"}:{" "}
        <span className="text-grey">{calculateTotalTime()} min</span>
      </p>

      <div className="flex md:flex-row flex-col md:items-center items-start justify-between w-full">
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
        <button
          onClick={toggleWishlist}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Image
            src={isWishlisted ? like_icon_fill : like_icon}
            width={24}
            height={24}
            alt="Wishlist icon"
          />
        </button>
      </div>

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
