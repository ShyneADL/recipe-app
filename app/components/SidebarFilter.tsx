import { useState, useEffect, useMemo } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FilterProps, CategoryProps } from "../types";

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
    max: 2000,
  });
  const [protein, setProtein] = useState<NutrientRange>({ min: 0, max: 200 });
  const [carbs, setCarbs] = useState<NutrientRange>({ min: 0, max: 200 });
  const [fats, setFats] = useState<NutrientRange>({ min: 0, max: 200 });
  const [difficulty, setDifficulty] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory =
        category === "all" || recipe.category.category === category;

      const matchesDifficulty =
        difficulty === "all" || recipe.difficulty.toLowerCase() === difficulty;

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
    const handleInputChange = (type: "min" | "max", inputValue: string) => {
      const numValue = Number(inputValue);
      if (!isNaN(numValue)) {
        onChange({
          ...value,
          [type]:
            type === "min"
              ? Math.min(numValue, value.max)
              : Math.max(numValue, value.min),
        });
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
            max={value.max}
            value={value.min}
            onChange={(e) => handleInputChange("min", e.target.value)}
            className="w-20"
          />
          <Label htmlFor={`${label}-max`} className="w-8 text-xs">
            Max
          </Label>
          <Input
            id={`${label}-max`}
            type="number"
            min={value.min}
            max={max}
            value={value.max}
            onChange={(e) => handleInputChange("max", e.target.value)}
            className="w-20"
          />
        </div>
        <Slider
          min={0}
          max={max}
          step={step}
          value={[value.min, value.max]}
          onValueChange={(newValue) =>
            onChange({ min: newValue[0], max: newValue[1] })
          }
          className="mt-2"
        />
      </div>
    );
  };

  return (
    <Card className="w-80">
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Recipe Categories</Label>
          <RadioGroup value={category} onValueChange={setCategory}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.category} id={cat.category} />
                <Label htmlFor={cat.category}>{cat.category}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Min-Max Range Sliders */}
        <RangeSlider
          label="Calories"
          value={calories}
          onChange={setCalories}
          max={2000}
          step={100}
        />

        <RangeSlider
          label="Protein (g)"
          value={protein}
          onChange={setProtein}
          max={200}
          step={20}
        />

        <RangeSlider
          label="Carbs (g)"
          value={carbs}
          onChange={setCarbs}
          max={200}
          step={20}
        />

        <RangeSlider
          label="Fats (g)"
          value={fats}
          onChange={setFats}
          max={200}
          step={20}
        />
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="difficult">Difficult</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
