import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { FilterProps, CategoryProps } from "@/app/types";
import { X, RefreshCw } from "lucide-react";

interface NutrientRange {
  min: number;
  max: number;
}

// Memoize the RangeSlider to prevent unnecessary re-renders
const RangeSlider = React.memo(
  ({
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
    const [minInputValue, setMinInputValue] = useState(value.min.toString());

    useEffect(() => {
      setInternalValue(value);
      setMinInputValue(value.min.toString());
    }, [value]);

    const handleInputChange = useCallback(
      (type: "min" | "max", inputValue: string) => {
        if (type === "min") {
          // Remove leading 0 when user starts typing
          const processedValue =
            inputValue === "0" ? "" : inputValue.replace(/^0+/, "");
          setMinInputValue(processedValue);

          if (processedValue === "") {
            // Don't update the actual filter until we have a valid number
            return;
          }

          const numValue = Number(processedValue);
          if (!isNaN(numValue)) {
            const updatedValue = {
              ...internalValue,
              min: Math.min(numValue, internalValue.max),
            };
            setInternalValue(updatedValue);
            onChange(updatedValue);
          }
        } else {
          const numValue = Number(inputValue);
          if (!isNaN(numValue)) {
            const updatedValue = {
              ...internalValue,
              max: Math.max(numValue, internalValue.min),
            };
            setInternalValue(updatedValue);
            onChange(updatedValue);
          }
        }
      },
      [internalValue, onChange]
    );
    return (
      <div className="macros-filters">
        <Label className="mt-2 font-semibold">{label}</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor={`${label}-min`} className="w-8 text-xs">
            Min
          </Label>
          <Input
            id={`${label}-min`}
            type="number"
            min={0}
            max={internalValue.max}
            value={minInputValue}
            onChange={(e) => handleInputChange("min", e.target.value)}
            className="w-20"
            placeholder="0"
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
            setInternalValue(updatedValue);
            setMinInputValue(updatedValue.min.toString());
            onChange(updatedValue);
          }}
          className="mt-2"
        />
      </div>
    );
  }
);

RangeSlider.displayName = "RangeSlider";

export default function SidebarFilter({
  recipes,
  setFilteredRecipes,
  categories,
  isOpen,
  onClose,
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

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    setCategory(urlCategory);
  }, [searchParams]);

  // Stable debounce function
  const debounce = useCallback(
    (func: (...args: any) => void, timeout = 1000) => {
      let timer: NodeJS.Timeout;
      return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), timeout);
      };
    },
    []
  );

  // Stable filter function
  const filterRecipes = useCallback(() => {
    const filtered = recipes.filter((recipe) => {
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
    setFilteredRecipes(filtered);
  }, [
    recipes,
    calories,
    protein,
    carbs,
    fats,
    difficulty,
    category,
    setFilteredRecipes,
  ]);

  // Stable debounced filter
  const debouncedFilter = useMemo(
    () => debounce(filterRecipes, 1000),
    [debounce, filterRecipes]
  );

  useEffect(() => {
    debouncedFilter();
  }, [debouncedFilter]);

  const resetFilters = useCallback(() => {
    setCalories({ min: 0, max: 1000 });
    setProtein({ min: 0, max: 100 });
    setCarbs({ min: 0, max: 100 });
    setFats({ min: 0, max: 100 });
    setDifficulty("All");
    setCategory("all");
    router.push(`/discover`);
  }, [router]);

  return (
    <div className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>
      <Card className="md:w-[400px] w-full h-full">
        <CardContent className="space-y-6 flex flex-col items-start gap-4">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-bold">Filters</h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <button onClick={onClose} className="md:hidden">
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Recipe Categories</Label>
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
                  }}
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
                    checked={category === cat.category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      router.push(`/discover?category=${e.target.value}`);
                    }}
                  />
                  <label className="category-text" htmlFor={cat.category}>
                    {cat.category}
                  </label>
                </div>
              ))}
            </form>
          </div>
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
            <Label htmlFor="difficulty" className="font-semibold">
              Difficulty Level
            </Label>
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
    </div>
  );
}
