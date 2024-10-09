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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const openModal = (recipe: RecipeProps) => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedRecipe(null);
  };

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
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`pagination-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Page;
