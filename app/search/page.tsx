"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import SidebarFilter from "@/app/components/SidebarFilter";
import "./search.modules.css";
import { RecipeProps, CategoryProps } from "@/app/types";
import { RecipeCard } from "@/app/components";

import { SearchBar } from "@/app/components";

const Page = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchRecipes = async () => {
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

        setRecipes(result); // Update with fetched recipes
        setFilteredRecipes(result); // Set initial filtered recipes

        // Extract unique categories from recipes
        const uniqueCategories = Array.from(
          new Set(result.map((recipe: RecipeProps) => recipe.category.category))
        ).map((category, index) => ({
          id: index,
          category: category as string,
          thumbnail: "", // Assuming no thumbnail available for now
        }));

        setCategories(uniqueCategories); // Set categories
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, []);

  // Pagination logic
  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredRecipes.length / pageSize);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (categoryParam) {
      // Apply the filter based on the category from the query parameter
      const filteredByCategory = recipes.filter(
        (recipe) =>
          recipe.category.category.toLowerCase() === categoryParam.toLowerCase()
      );
      setFilteredRecipes(filteredByCategory);
    }
  }, [categoryParam, recipes]);

  return (
    <div className="flex items-start gap-6 padding-x max-width">
      <div className="sidebar-wrapper">
        <SidebarFilter
          recipes={recipes}
          setFilteredRecipes={setFilteredRecipes}
          categories={categories}
        />
      </div>
      <main className="w-full">
        <ul className="recipe-container">
          {currentRecipes.length > 0 ? (
            currentRecipes.map((recipe) => {
              return <RecipeCard key={recipe.id} recipe={recipe} />;
            })
          ) : (
            <li>There are no recipes that match your filter.</li>
          )}
        </ul>

        {/* Pagination Controls */}
        <div className="pagination">
          {/* Previous Button */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          {/* First Page */}
          <button
            onClick={() => paginate(1)}
            className={`pagination-btn ${
              currentPage === 1 ? "active text-primary-red" : ""
            }`}
          >
            1
          </button>

          {/* Show ellipsis if totalPages > 9 and currentPage is greater than 3 */}
          {totalPages > 9 && currentPage > 3 && <span>...</span>}

          {/* Pages around currentPage: 2, 3, and 4 */}
          {Array.from({ length: 9 }).map((_, index) => {
            const page = currentPage - 1 + index;
            if (page > 1 && page < totalPages) {
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
            return null;
          })}

          {/* Show ellipsis before the last page if totalPages > 9 and currentPage is less than totalPages - 2 */}
          {totalPages > 9 && currentPage < totalPages - 2 && <span>...</span>}

          {/* Last Page */}
          {totalPages > 1 && (
            <button
              onClick={() => paginate(totalPages)}
              className={`pagination-btn ${
                currentPage === totalPages ? "active text-primary-red" : ""
              }`}
            >
              {totalPages}
            </button>
          )}

          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Page;
