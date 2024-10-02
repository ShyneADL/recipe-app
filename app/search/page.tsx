"use client";
import React, { useState, useEffect } from "react";
import SidebarFilter from "../components/SidebarFilter";
import "./search.modules.css";
import { RecipeProps, CategoryProps } from "../types";

const Page = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]); // State for categories

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

  return (
    <div className="flex items-start gap-6 padding-x max-width">
      <div className="sidebar-wrapper">
        <SidebarFilter
          recipes={recipes}
          setFilteredRecipes={setFilteredRecipes}
          categories={categories} // Pass categories to the filter
        />
      </div>
      <main className="w-full">
        <ul>
          {filteredRecipes.map((recipe, index) => (
            <li key={index}>{recipe.recipe}</li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Page;
