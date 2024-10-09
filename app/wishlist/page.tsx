"use client";
import React, { useState, useEffect } from "react";
import { RecipeProps } from "@/app/types";
import { RecipeCard } from "@/app/components";

const Page = () => {
  const [wishlistItems, setWishlistItems] = useState<RecipeProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 12;

  useEffect(() => {
    const fetchWishlistItems = async () => {
      setIsLoading(true);
      try {
        // Get wishlist IDs from localStorage
        const wishlistData = localStorage.getItem("wishlist");
        const wishlistIds = wishlistData ? JSON.parse(wishlistData) : [];

        if (wishlistIds.length === 0) {
          setWishlistItems([]);
          setIsLoading(false);
          return;
        }

        // Fetch all recipes from your API
        const response = await fetch("https://keto-diet.p.rapidapi.com/", {
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
            "x-rapidapi-host": "keto-diet.p.rapidapi.com",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const allRecipes = await response.json();

        // Filter recipes to only include those in the wishlist
        const wishlisted = allRecipes.filter((recipe: RecipeProps) =>
          wishlistIds.includes(recipe.id)
        );

        setWishlistItems(wishlisted);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, []); // Empty dependency array means this runs once on mount

  // Add debugging logs
  useEffect(() => {
    const wishlistData = localStorage.getItem("wishlist");
    console.log("Wishlist IDs in localStorage:", wishlistData);
    console.log("Current wishlist items:", wishlistItems);
  }, [wishlistItems]);

  // Pagination logic
  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = wishlistItems.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
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
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  return (
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
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600">
              Start adding recipes to your wishlist to see them here!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
