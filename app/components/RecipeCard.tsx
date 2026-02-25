"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import Image from "next/image";
import { getChefHatCount } from "../utils";
import { RecipeProps } from "../types";

// Lazy-load the heavy modal — it's only needed on click, not on page load
const RecipeDetails = lazy(() => import("./RecipeDetails"));

interface RecipeCardProps {
  recipe: RecipeProps;
}

const RecipeCard: React.FC<RecipeCardProps> = React.memo(({ recipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(
    null,
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load wishlist state on mount
  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsWishlisted(Array.isArray(wishlist) && wishlist.includes(recipe.id));
    } catch {
      // Silently handle JSON parse errors
    }
  }, [recipe.id]);

  const openModal = useCallback(() => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  }, [recipe]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedRecipe(null);
  }, []);

  // Memoize derived values so they're not recalculated on every render
  const totalTime = useMemo(() => {
    if (
      recipe.cook_time_in_minutes === null &&
      recipe.prep_time_in_minutes === null
    ) {
      return 0;
    }
    return (
      (recipe.cook_time_in_minutes || 0) + (recipe.prep_time_in_minutes || 0)
    );
  }, [recipe.cook_time_in_minutes, recipe.prep_time_in_minutes]);

  const chefHatCount = useMemo(
    () => getChefHatCount(recipe.difficulty),
    [recipe.difficulty],
  );

  const timeLabel =
    recipe.cook_time_in_minutes === 0 ? "Prep time" : "Cooking time";

  const toggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const stored = localStorage.getItem("wishlist");
        let wishlist: number[] = stored ? JSON.parse(stored) : [];
        if (isWishlisted) {
          wishlist = wishlist.filter((id) => id !== recipe.id);
        } else {
          wishlist.push(recipe.id);
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsWishlisted((prev) => !prev);
      } catch {
        // Silently handle localStorage errors
      }
    },
    [isWishlisted, recipe.id],
  );

  return (
    <div onClick={openModal} className="recipe-item">
      <Image
        src={recipe.image}
        alt={recipe.recipe}
        width={400}
        height={225}
        className="recipe-image w-full h-auto object-cover"
        // Only eagerly load the first few visible cards
        loading="lazy"
        sizes="(max-width: 768px) 49vw, (max-width: 1200px) 33vw, 25vw"
      />
      <h3 className="recipe-name">{recipe.recipe}</h3>

      <p className="recipe-text">
        Calories: <span className="text-grey">{recipe.calories} kcal</span>
      </p>

      <p className="recipe-text">
        {timeLabel}: <span className="text-grey">{totalTime} min</span>
      </p>

      <div className="flex md:flex-row flex-col md:items-center items-start justify-between w-full">
        <div className="flex items-center justify-between w-[175px]">
          <p className="recipe-text">Difficulty:</p>
          <div className="flex items-center justify-start gap-[6px] w-[100px]">
            {Array.from({ length: chefHatCount }).map((_, index) => (
              <Image
                key={index}
                src="/chef.webp"
                alt="chef hat icon"
                width={25}
                height={25}
                className="chef-hat"
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <button
          onClick={toggleWishlist}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {/* Inline SVG instead of two separate image files to avoid extra HTTP requests */}
          {isWishlisted ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#FC0000"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="#FC0000"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Only render the modal portal when it's actually been opened */}
      {selectedRecipe && (
        <Suspense fallback={null}>
          <RecipeDetails
            isOpen={isOpen}
            closeModal={closeModal}
            recipe={selectedRecipe}
          />
        </Suspense>
      )}
    </div>
  );
});

RecipeCard.displayName = "RecipeCard";

export default RecipeCard;
