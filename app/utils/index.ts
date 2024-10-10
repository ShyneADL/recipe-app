import { RecipeProps } from "@/app/types";

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

export const getChefHatCount = (difficulty: string): number => {
  switch (difficulty) {
    case "Easy":
      return 1;
    case "Medium":
      return 2;
    case "Difficult":
      return 3;
    default:
      return 0;
  }
};
