import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxOptions,
  ComboboxInput,
  Transition,
} from "@headlessui/react";
import { RecipeProps } from "../types"; // Make sure to import RecipeProps

interface SearchRecipeProps {
  recipes: RecipeProps[]; // Should be an array of recipes
  setRecipe: (recipe: RecipeProps | null) => void; // Set recipe based on user selection
}

const SearchRecipe = ({ recipes, setRecipe }: SearchRecipeProps) => {
  const [query, setQuery] = useState("");

  // Log the entire recipes array
  useEffect(() => {
    console.log("All Recipes: ", recipes);
  }, [recipes]);

  // Filter recipes based on the query
  const filteredRecipes =
    query === ""
      ? recipes || [] // If no query, return all recipes
      : (recipes || []).filter((item) => {
          const recipeName = item.recipe.toLowerCase(); // Access the recipe name and convert to lowercase
          const cleanedQuery = query.toLowerCase().replace(/\s+/g, ""); // Clean the query
          const cleanedRecipeName = recipeName.replace(/\s+/g, ""); // Clean the recipe name
          const match = cleanedRecipeName.includes(cleanedQuery); // Check for a match

          // Log each comparison for debugging
          console.log(
            `Searching for: "${cleanedQuery}", Recipe: "${cleanedRecipeName}", Match: ${match}`
          );
          return match; // Return true if there's a match
        });

  // Log filtered recipes whenever the query or filteredRecipes changes
  useEffect(() => {
    console.log("Filtered Recipes: ", filteredRecipes);
  }, [filteredRecipes]);

  return (
    <div className="search-manufacturer">
      <Combobox value={null} onChange={setRecipe}>
        <div className="relative w-full">
          <ComboboxButton className="absolute top-[14px]">
            <Image
              src="/food-logo.svg"
              width={20}
              height={20}
              className="ml-4"
              alt="recipe logo"
            />
          </ComboboxButton>

          <ComboboxInput
            className="search-recipe__input"
            displayValue={(item: RecipeProps | null) =>
              item ? item.recipe : ""
            } // Display the recipe name
            onChange={(event) => setQuery(event.target.value)} // Update the search query when the input changes
            placeholder="Search Recipes"
          />

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")} // Reset the search query after the transition completes
          >
            <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <Combobox.Option key={recipe.id} value={recipe}>
                    {({ active }) => (
                      <div
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } cursor-pointer select-none relative py-2 pl-10 pr-4`}
                      >
                        {recipe.recipe}
                      </div>
                    )}
                  </Combobox.Option>
                ))
              ) : (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                  No results found
                </div>
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchRecipe;
