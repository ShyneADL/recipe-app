import Image from "next/image";
import { Fragment, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";

import { SearchRecipeProps } from "@/app/types";

const SearchRecipe = ({ recipe, setRecipe }: SearchRecipeProps) => {
  const [query, setQuery] = useState("");

  return (
    <div className="search-manufacturer">
      <Combobox value={recipe} onChange={setRecipe}>
        <div className="relative w-full">
          {/* Button for the combobox. Click on the icon to see the complete dropdown */}
          <ComboboxButton className="absolute top-[14px]">
            <Image
              src="/car-logo.svg"
              width={20}
              height={20}
              className="ml-4"
              alt="car logo"
            />
          </ComboboxButton>

          {/* Input field for searching */}
          <Combobox.Input
            className="search-recipe__input"
            displayValue={(item: string) => item}
            onChange={(event) => setQuery(event.target.value)} // Update the search query when the input changes
            placeholder="Vegan Recipes"
          />

          {/* Transition for displaying the options */}
          <Transition
            as={Fragment} // group multiple elements without introducing an additional DOM node i.e., <></>
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")} // Reset the search query after the transition completes
          >
            <ComboboxOptions
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              static
            ></ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchRecipe;
