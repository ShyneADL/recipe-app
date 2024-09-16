import { MouseEventHandler } from "react";

export interface RecipeProps {
  id: number;
  recipe: string;
  category: string;
  prep_time_in_minutes: number;
  prep_time_note: string | null;
  cook_time_in_minutes: number;
  cook_time_note: string | null;
  difficulty: string;
  serving: number;
  image: string;
  measurements: (number | null)[];
  ingredients: (string | null)[];
  directions: (string | null)[];
  calories: number;
  fats_in_grams: number;
  carbohydrates_in_grams: number;
  proteins_in_grams: number;
}

export interface FilterProps {
  protein?: string;
  carbohydrates?: string;
  fats?: string;
  calories?: number;
  cooktimeinminutes?: number;
  preptimeinminutes?: number;
}

export interface HomeProps {
  searchParams: FilterProps;
}

export interface RecipeCardProps {
  protein?: string;
  carbohydrates?: string;
  fats?: string;
  calories?: number;
  cooktimeinminutes?: number;
  preptimeinminutes?: number;
}

export interface CustomButtonProps {
  isDisabled?: boolean;
  btnType?: "button" | "submit";
  containerStyles?: string;
  textStyles?: string;
  title: string;
  rightIcon?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface OptionProps {
  title: string;
  value: string;
}

export interface CustomFilterProps {
  title: string;
  options: OptionProps[];
}

export interface ShowMoreProps {
  pageNumber: number;
  isNext: boolean;
}

export interface SearchRecipeProps {
  recipe: string;
  setRecipe: (recipe: string) => void;
}
