"use client";
import React, { useState, useEffect, Suspense } from "react";
import { RecipeProps } from "@/app/types";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";
import { Loading, RecipeCard } from "@/app/components";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistItems, setWishlistItems] = useState<RecipeProps[]>([]);
  const pageSize = 12;

  const { data: recipes, isLoading } = useRecipes();

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      const wishlistIds = JSON.parse(storedWishlist);
      const wishlistRecipes =
        recipes?.filter((recipe) => wishlistIds.includes(recipe.id)) || [];
      setWishlistItems(wishlistRecipes);
    }
  }, [recipes]);

  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = wishlistItems.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe,
  );
  const totalPages = Math.ceil(wishlistItems.length / pageSize);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 9) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (isLoading) {
    return (
      <ul className="recipe-container">
        {Array.from({ length: pageSize }).map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </ul>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex items-start gap-6 padding-x max-width">
        <main className="w-full">
          {wishlistItems.length > 0 ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

              <ul className="recipe-container">
                {currentRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((number, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof number === "number" ? paginate(number) : null
                      }
                      className={`pagination-btn ${
                        currentPage === number
                          ? "active bg-primary-red text-white"
                          : ""
                      } ${typeof number === "string" ? "cursor-default" : ""}`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <h2 className="text-xl font-semibold mb-2 dark:text-slate-100">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start adding recipes to your wishlist to see them here!
              </p>
            </div>
          )}
        </main>
      </div>
    </Suspense>
  );
};

export default Page;
