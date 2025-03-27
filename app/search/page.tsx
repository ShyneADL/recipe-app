"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RecipeProps } from "@/app/types";
import { Loading, RecipeCard, SearchBar } from "@/app/components";
import { useRecipes } from "../hooks/useRecipes";

// Separate the content that uses useSearchParams into a client component
const SearchContent = () => {
  const { data: recipes = [], isLoading: isLoadingRecipes } = useRecipes();
  const [displayedRecipes, setDisplayedRecipes] = useState<RecipeProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter recipes when search query changes
  useEffect(() => {
    if (!searchQuery?.trim()) {
      setDisplayedRecipes(recipes); // Show all recipes when no search query
      return;
    }

    const filtered = recipes.filter((recipe) =>
      recipe.recipe.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setDisplayedRecipes(filtered);
  }, [searchQuery, recipes]);

  // Pagination logic
  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = displayedRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(displayedRecipes.length / pageSize);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="w-full max-w-3xl mx-auto my-6">
        <SearchBar />
      </div>

      <main className="w-full">
        {isLoadingRecipes ? (
          <div className="flex justify-center items-center h-40">
            <Loading />
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Search results for: "{searchQuery}"
                </h2>
                <p className="text-gray-600">
                  Found {displayedRecipes.length} recipes
                </p>
              </div>
            )}

            <ul className="recipe-container">
              {currentRecipes.length > 0 ? (
                currentRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))
              ) : (
                <li className="text-center w-full py-8">
                  No recipes found matching your search.
                </li>
              )}
            </ul>

            {displayedRecipes.length > pageSize && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <button
                  onClick={() => paginate(1)}
                  className={`pagination-btn ${
                    currentPage === 1 ? "active text-primary-red" : ""
                  }`}
                >
                  1
                </button>

                {Array.from({ length: Math.min(totalPages - 2, 3) }).map(
                  (_, index) => {
                    const page = index + 2;
                    return (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`pagination-btn ${
                          currentPage === page ? "active text-primary-red" : ""
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                {totalPages > 1 && (
                  <button
                    onClick={() => paginate(totalPages)}
                    className={`pagination-btn ${
                      currentPage === totalPages
                        ? "active text-primary-red"
                        : ""
                    }`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

// Main component with Suspense boundary
const SearchPage = () => {
  return (
    <div className="flex flex-col items-start gap-6 padding-x max-width">
      <Suspense fallback={<Loading />}>
        <SearchContent />
      </Suspense>
    </div>
  );
};

export default SearchPage;
