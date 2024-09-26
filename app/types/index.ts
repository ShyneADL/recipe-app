import { MouseEventHandler } from "react";

export interface RecipeProps {
  id: number;
  recipe: string;
  category: CategoryProps;
  prep_time_in_minutes: number;
  prep_time_note: string | null;
  cook_time_in_minutes: number;
  cook_time_note: string | null;
  difficulty: string;
  serving: number;
  image: string;
  measurement_1?: number | null;
  measurement_2?: number | null;
  measurement_3?: number | null;
  measurement_4?: number | null;
  measurement_5?: number | null;
  measurement_6?: number | null;
  measurement_7?: number | null;
  measurement_8?: number | null;
  measurement_9?: number | null;
  measurement_10?: number | null;
  ingredient_1?: string | null;
  ingredient_2?: string | null;
  ingredient_3?: string | null;
  ingredient_4?: string | null;
  ingredient_5?: string | null;
  ingredient_6?: string | null;
  ingredient_7?: string | null;
  ingredient_8?: string | null;
  ingredient_9?: string | null;
  ingredient_10?: string | null;
  directions_step_1?: string | null;
  directions_step_2?: string | null;
  directions_step_3?: string | null;
  directions_step_4?: string | null;
  directions_step_5?: string | null;
  directions_step_6?: string | null;
  directions_step_7?: string | null;
  directions_step_8?: string | null;
  directions_step_9?: string | null;
  directions_step_10?: string | null;
  calories: number;
  fat_in_grams: number;
  carbohydrates_in_grams: number;
  protein_in_grams: number;
}

export interface RecipeDetailsProps {
  recipe: RecipeProps;
  isOpen: boolean;
  closeModal: () => void;
}

export interface CategoryProps {
  id: number;
  category: string;
  thumbnail: string;
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
