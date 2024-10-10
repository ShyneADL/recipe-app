"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilter from "@/app/components/SidebarFilter";
import { RecipeProps, CategoryProps } from "@/app/types";
import { RecipeCard } from "@/app/components";

const DiscoverPage = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 12;

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Reset pagination when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      const url = "https://keto-diet.p.rapidapi.com/";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
          "x-rapidapi-host": "keto-diet.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const result = await response.json();

        setRecipes(result);

        // Apply initial filters based on URL parameters
        let filtered = [...result];

        // Apply category filter if exists
        if (categoryParam) {
          filtered = filtered.filter(
            (recipe) =>
              recipe.category.category.toLowerCase() ===
              categoryParam.toLowerCase()
          );
        }

        setFilteredRecipes(filtered);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(result.map((recipe: RecipeProps) => recipe.category.category))
        ).map((category, index) => ({
          id: index,
          category: category as string,
          thumbnail: "",
        }));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [categoryParam]);

  // Pagination logic
  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-start gap-6 padding-x max-width">
      <div className="flex w-full gap-6">
        <div className="sidebar-wrapper">
          <SidebarFilter
            recipes={recipes}
            setFilteredRecipes={setFilteredRecipes}
            categories={categories}
          />
        </div>

        <main className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <span className="loading-spinner">Loading...</span>
            </div>
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

                  <button
                    onClick={() => paginate(1)}
                    className={`pagination-btn ${
                      currentPage === 1 ? "active text-primary-red" : ""
                    }`}
                  >
                    1
                  </button>

                  {Array.from({ length: Math.min(totalPages - 2, 7) }).map(
                    (_, index) => {
                      const page = index + 2;
                      return (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`pagination-btn ${
                            currentPage === page
                              ? "active text-primary-red"
                              : ""
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
      </div>
    </div>
  );
};

export default DiscoverPage;
