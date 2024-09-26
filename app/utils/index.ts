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

export const gatherIngredients = (recipe: RecipeProps): (string | null)[] => {
  const ingredients: (string | null)[] = [];

  // Loop through the ingredient fields and collect only the string or null values
  for (let i = 1; i <= 10; i++) {
    const ingredient = recipe[`ingredient_${i}` as keyof RecipeProps];

    // Only push if the ingredient is a string or null
    if (typeof ingredient === "string" || ingredient === null) {
      ingredients.push(ingredient);
    }
  }

  return ingredients;
};
export const gatherMeasurements = (recipe: RecipeProps): (string | null)[] => {
  const measurements: (string | null)[] = [];

  // Loop through the measurement fields and collect only the string or null values
  for (let i = 1; i <= 10; i++) {
    const measurement = recipe[`measurement_${i}` as keyof RecipeProps];

    // Only push if the measurement is a string or null
    if (typeof measurement === "string" || measurement === null) {
      measurements.push(measurement);
    }
  }

  return measurements;
};

export const gatherDirections = (recipe: RecipeProps): (string | null)[] => {
  const directions: (string | null)[] = [];

  // Loop through the direction fields and collect only the string or null values
  for (let i = 1; i <= 10; i++) {
    const direction = recipe[`directions_step_${i}` as keyof RecipeProps];

    // Only push if the direction is a string or null
    if (typeof direction === "string" || direction === null) {
      directions.push(direction);
    }
  }

  return directions;
};

export const gatherIngredientsAndMeasurements = (
  recipe: RecipeProps
): { ingredient: string | null; measurement: number | null }[] => {
  const combined: { ingredient: string | null; measurement: number | null }[] =
    [];

  for (let i = 1; i <= 10; i++) {
    const ingredient = recipe[`ingredient_${i}` as keyof RecipeProps] as
      | string
      | null;
    const measurement = recipe[`measurement_${i}` as keyof RecipeProps] as
      | number
      | null;

    // Only push the ingredient and measurement if they exist
    if (ingredient || measurement) {
      combined.push({ ingredient, measurement });
    }
  }

  return combined;
};
