"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilter from "@/app/components/SidebarFilter";
import { RecipeProps, CategoryProps } from "@/app/types";
import { RecipeCard } from "@/app/components";
import Image from "next/image";
import { useRecipesAndCategories } from "../hooks/useRecipes";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const RecipeContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const pageSize = 12;

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { data: recipesAndCategories, isLoading } = useRecipesAndCategories();
  const recipes = recipesAndCategories?.recipes || [];
  const categories = recipesAndCategories?.categories || [];

  // Filter recipes when category changes or when data is loaded
  useEffect(() => {
    if (!recipes.length) return;

    if (categoryParam) {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.category?.category?.toLowerCase() ===
          categoryParam.toLowerCase()
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [categoryParam, recipes]);

  const toggleFilters = () => setIsOpen(!isOpen);
  const closeFilters = () => setIsOpen(false);

  // For SidebarFilter - when filter is changed within the component
  const handleFilterChange = (newFilteredRecipes: RecipeProps[]) => {
    setFilteredRecipes(newFilteredRecipes);
    setCurrentPage(1);
  };

  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="relative flex w-full gap-6">
      <div
        onClick={toggleFilters}
        className="fixed bottom-2 z-2 left-[50%] translate-x-[-50%] rounded-full p-2 bg-black md:hidden flex items-center gap-1"
      >
        <p className="text-white">Filter</p>
        <Image src="/filter.svg" alt="filter icon" width={24} height={24} />
      </div>

      <SidebarFilter
        recipes={recipes}
        setFilteredRecipes={handleFilterChange}
        categories={categories}
        onClose={closeFilters}
        isOpen={isOpen}
      />

      <main className="w-full">
        {isLoading ? (
          <ul className="recipe-container">
            {Array.from({ length: pageSize }).map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))}
          </ul>
        ) : (
          <>
            <ul className="recipe-container">
              {currentRecipes.length > 0 ? (
                currentRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))
              ) : (
                <li className="text-center w-full py-8">
                  No recipes found matching your criteria.
                </li>
              )}
            </ul>

            {filteredRecipes.length > pageSize && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  // Show limited pagination for many pages
                  if (
                    totalPages > 5 &&
                    page !== 1 &&
                    page !== totalPages &&
                    Math.abs(page - currentPage) > 1
                  ) {
                    if (page === 2 || page === totalPages - 1) {
                      return <span key={page}>...</span>;
                    }
                    return null;
                  }
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
                })}

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
    </div>
  );
};

const DiscoverPage = () => {
  return (
    <div className="flex flex-col items-start gap-6 padding-x max-width">
      <RecipeContent />
    </div>
  );
};

export default DiscoverPage;
