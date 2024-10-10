import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import the necessary hooks
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FilterProps, CategoryProps } from "@/app/types";

interface NutrientRange {
  min: number;
  max: number;
}

export default function SidebarFilter({
  recipes,
  setFilteredRecipes,
  categories,
}: FilterProps & { categories: CategoryProps[] }) {
  const [calories, setCalories] = useState<NutrientRange>({
    min: 0,
    max: 1000,
  });
  const [protein, setProtein] = useState<NutrientRange>({ min: 0, max: 100 });
  const [carbs, setCarbs] = useState<NutrientRange>({ min: 0, max: 100 });
  const [fats, setFats] = useState<NutrientRange>({ min: 0, max: 100 });
  const [difficulty, setDifficulty] = useState<string>("All");
  const [category, setCategory] = useState<string>("all");

  const searchParams = useSearchParams(); // Get the current URL search params
  const router = useRouter();

  // Synchronize category with the URL query param
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    setCategory(urlCategory);
  }, [searchParams]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory =
        category === "all" || recipe.category.category === category;

      const matchesDifficulty =
        difficulty === "All" || recipe.difficulty === difficulty;

      return (
        recipe.calories >= calories.min &&
        recipe.calories <= calories.max &&
        recipe.protein_in_grams >= protein.min &&
        recipe.protein_in_grams <= protein.max &&
        recipe.carbohydrates_in_grams >= carbs.min &&
        recipe.carbohydrates_in_grams <= carbs.max &&
        recipe.fat_in_grams >= fats.min &&
        recipe.fat_in_grams <= fats.max &&
        matchesDifficulty &&
        matchesCategory
      );
    });
  }, [recipes, calories, protein, carbs, fats, difficulty, category]);

  useEffect(() => {
    setFilteredRecipes(filteredRecipes);
  }, [filteredRecipes, setFilteredRecipes]);

  // Function to reset all filters to default
  const resetFilters = () => {
    setCalories({ min: 0, max: 1000 });
    setProtein({ min: 0, max: 100 });
    setCarbs({ min: 0, max: 100 });
    setFats({ min: 0, max: 100 });
    setDifficulty("all");
    setCategory("all");
    router.push(`/discover`); // Reset the URL to remove query params
  };
  // Debounce utility
  const debounce = (func: (...args: any) => void, timeout = 300) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), timeout);
    };
  };

  // RangeSlider component
  const RangeSlider = ({
    label,
    value,
    onChange,
    max,
    step,
  }: {
    label: string;
    value: NutrientRange;
    onChange: (value: NutrientRange) => void;
    max: number;
    step: number;
  }) => {
    const [internalValue, setInternalValue] = useState(value);

    // Debounce state update to prevent constant re-renders
    const debouncedOnChange = useMemo(
      () => debounce((newValue: NutrientRange) => onChange(newValue), 300),
      [onChange]
    );

    const handleInputChange = (type: "min" | "max", inputValue: string) => {
      const numValue = Number(inputValue);
      if (!isNaN(numValue)) {
        const updatedValue =
          type === "min"
            ? { ...internalValue, min: Math.min(numValue, internalValue.max) }
            : { ...internalValue, max: Math.max(numValue, internalValue.min) };

        setInternalValue(updatedValue); // Update local input state immediately
        debouncedOnChange(updatedValue); // Debounce the global state update
      }
    };

    return (
      <div className="sidebar">
        <Label className="mt-2">{label}</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor={`${label}-min`} className="w-8 text-xs">
            Min
          </Label>
          <Input
            id={`${label}-min`}
            type="number"
            min={0}
            max={internalValue.max}
            value={internalValue.min}
            onChange={(e) => handleInputChange("min", e.target.value)}
            className="w-20"
          />
          <Label htmlFor={`${label}-max`} className="w-8 text-xs">
            Max
          </Label>
          <Input
            id={`${label}-max`}
            type="number"
            min={internalValue.min}
            max={max}
            value={internalValue.max}
            onChange={(e) => handleInputChange("max", e.target.value)}
            className="w-20"
          />
        </div>
        <Slider
          min={0}
          max={max}
          step={step}
          value={[internalValue.min, internalValue.max]}
          onValueChange={(newValue) => {
            const updatedValue = { min: newValue[0], max: newValue[1] };
            setInternalValue(updatedValue); // Update slider state locally
            debouncedOnChange(updatedValue); // Debounce global state update
          }}
          className="mt-2"
        />
      </div>
    );
  };

  return (
    <Card className="w-[400px]">
      <CardContent className="space-y-6 flex flex-col items-start gap-4">
        <div className="space-y-2">
          <Label>Recipe Categories</Label>
          {/* Category radio group */}
          <form className="category-filter">
            <div className="category-item ">
              <input
                name="category"
                type="radio"
                value="all"
                id="all"
                checked={category === "all"}
                onChange={(e) => {
                  setCategory(e.target.value);
                  router.push(`/discover`);
                }} // Update the state and URL when the value changes
              />
              <label className="category-text" htmlFor="all">
                All
              </label>
            </div>

            {categories.map((cat) => (
              <div
                key={cat.id}
                className="category-item flex items-center space-x-2"
              >
                <input
                  name="category"
                  type="radio"
                  value={cat.category}
                  id={cat.category}
                  checked={category === cat.category} // Checks if the current category matches the selected one
                  onChange={(e) => {
                    setCategory(e.target.value);
                    router.push(`/discover?category=${e.target.value}`); // Update the URL when the value changes
                  }}
                />
                <label className="category-text" htmlFor={cat.category}>
                  {cat.category}
                </label>
              </div>
            ))}
          </form>
        </div>
        {/* Min-Max Range Sliders */}
        <RangeSlider
          label="Calories"
          value={calories}
          onChange={setCalories}
          max={1000}
          step={100}
        />
        <RangeSlider
          label="Protein (g)"
          value={protein}
          onChange={setProtein}
          max={100}
          step={20}
        />

        <RangeSlider
          label="Carbs (g)"
          value={carbs}
          onChange={setCarbs}
          max={100}
          step={20}
        />
        <RangeSlider
          label="Fats (g)"
          value={fats}
          onChange={setFats}
          max={100}
          step={20}
        />
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Difficult">Difficult</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
