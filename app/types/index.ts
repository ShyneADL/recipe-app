import { MouseEventHandler } from "react";

export interface RecipeProps {
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
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
