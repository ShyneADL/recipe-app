import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxOptions,
  ComboboxInput,
  Transition,
} from "@headlessui/react";
import { RecipeProps } from "../types";

interface SearchRecipeProps {
  recipes: RecipeProps[];
  setRecipe: (recipe: RecipeProps | null) => void;
}

const SearchRecipe = ({ recipes, setRecipe }: SearchRecipeProps) => {
  const [query, setQuery] = useState("");

  const filteredRecipes =
    query === ""
      ? recipes
      : recipes.filter((item) =>
          item.recipe.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="search-manufacturer">
      <Combobox value={null} onChange={setRecipe}>
        {" "}
        {/* Handles single recipe */}
        <div className="relative flex gap-3 items-center w-full">
          <ComboboxButton className="">
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
            displayValue={(recipe: RecipeProps) => recipe?.recipe || ""}
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
