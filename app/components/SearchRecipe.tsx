import Image from "next/image";
import { Fragment } from "react";
import { X } from "lucide-react";
import {
  Combobox,
  ComboboxOptions,
  ComboboxInput,
  Transition,
} from "@headlessui/react";
import { RecipeProps } from "@/app/types";

interface SearchRecipeProps {
  recipes: RecipeProps[];
  onSelect: (recipe: RecipeProps | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClear: () => void;
}

const SearchRecipe = ({
  recipes,
  onSelect,
  searchQuery,
  setSearchQuery,
  onClear,
}: SearchRecipeProps) => {
  const filteredRecipes =
    searchQuery === ""
      ? recipes
      : recipes.filter((item) =>
          item.recipe.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="search-recipe">
      <Combobox value={null} onChange={onSelect}>
        <div className="relative flex flex-row-reverse items-center justify-center w-full">
          <button type="submit" className="z-10">
            <Image
              src="/magnifying-glass.svg"
              alt="magnifying glass"
              width={40}
              height={40}
              className="object-contain"
            />
          </button>

          <div className="relative">
            <ComboboxInput
              className="search-recipe__input relative"
              displayValue={() => searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search Recipes"
              value={searchQuery}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onClear();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 z-[10] rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ComboboxOptions className="absolute top-10 left-[45%] translate-x-[-45%] mt-5 max-h-60 w-[400px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <Combobox.Option key={recipe.id} value={recipe}>
                    {({ active }) => (
                      <div
                        className={`${
                          active ? "bg-primary-red text-white" : "text-gray-900"
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
