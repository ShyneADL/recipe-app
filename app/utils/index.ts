import { RecipeProps, FilterProps } from "@/app/types";

export const updateSearchParams = (type: string, value: string) => {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);

  // Set the specified search parameter to the given value
  searchParams.set(type, value);

  // Set the specified search parameter to the given value
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};

export const deleteSearchParams = (type: string) => {
  // Set the specified search parameter to the given value
  const newSearchParams = new URLSearchParams(window.location.search);

  // Delete the specified search parameter
  newSearchParams.delete(type.toLocaleLowerCase());

  // Construct the updated URL pathname with the deleted search parameter
  const newPathname = `${
    window.location.pathname
  }?${newSearchParams.toString()}`;

  return newPathname;
};

export async function fetchRecipes(filters: FilterProps) {
  const {
    protein,
    carbohydrates,
    fats,
    calories,
    cooktimeinminutes,
    preptimeinminutes,
  } = filters;

  // Set the required headers for the API request
  const headers: HeadersInit = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
    "X-RapidAPI-Host": "keto-diet.p.rapidapi.com",
  };

  // Set the required headers for the API request
  const response = await fetch(
    `https://keto-diet.p.rapidapi.com/recipes?protein=${protein}&carbohydrates=${carbohydrates}&fats=${fats}&calories=${calories}&cooktimeinminutes=${cooktimeinminutes}&preptimeinminutes=${preptimeinminutes}`,
    {
      headers: headers,
    }
  );

  // Parse the response as JSON
  const result = await response.json();

  return result;
}
