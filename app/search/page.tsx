"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SidebarFilter from "@/app/components/SidebarFilter";
import "./search.modules.css";
import { RecipeProps, CategoryProps } from "@/app/types";
import { RecipeDetails } from "@/app/components";
import { getChefHatCount } from "@/app/utils";
import { SearchBar } from "@/app/components";

const Page = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 15 recipes per page

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

  // Calculate the index of the first and last recipe on the current page
  const indexOfLastRecipe = currentPage * pageSize;
  const indexOfFirstRecipe = indexOfLastRecipe - pageSize;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  // Change page function
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);

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
              const chefHatCount = getChefHatCount(recipe.difficulty);
              return (
                <div
                  key={recipe.id}
                  onClick={() => openModal(recipe)}
                  className="recipe-item"
                >
                  <Image
                    src={recipe.image}
                    alt={recipe.recipe}
                    width={200}
                    height={112.5}
                    className="recipe-image"
                  />
                  <h3 className="recipe-name">{recipe.recipe}</h3>

                  <p className="recipe-text">
                    Calories:{" "}
                    <span className="text-grey">{recipe.calories} kcal</span>{" "}
                  </p>

                  <p className="recipe-text">
                    {recipe.cook_time_in_minutes === 0
                      ? "Prep time"
                      : "Cooking time"}
                    :{" "}
                    <span className="text-grey">
                      {recipe.cook_time_in_minutes === 0
                        ? recipe.prep_time_in_minutes
                        : recipe.cook_time_in_minutes}{" "}
                      min
                    </span>
                  </p>

                  {/* Render Chef Hats Based on Difficulty */}
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

                  {/* Recipe Details Modal */}
                  {selectedRecipe && (
                    <RecipeDetails
                      isOpen={isOpen}
                      closeModal={closeModal}
                      recipe={selectedRecipe}
                    />
                  )}
                </div>
              );
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
