export interface Recipe {
  id: string;
  recipe: string;
  image: string;
  calories: number;
  cook_time_in_minutes: number;
  prep_time_in_minutes: number;
  difficulty: number;
  category: {
    category: string;
  };
}

export interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
}
