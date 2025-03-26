import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { RecipeCardProps } from "../types";

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const calculateTotalTime = () => {
    return recipe.cook_time_in_minutes + recipe.prep_time_in_minutes;
  };

  const chefHatCount = Math.ceil(recipe.difficulty / 2);

  return (
    <TouchableOpacity
      style={tw`flex-1 bg-white rounded-2xl p-3 mb-4 shadow-sm`}
      onPress={onPress}
    >
      <Image
        source={{ uri: recipe.image }}
        style={tw`w-full h-48 rounded-xl mb-2`}
        resizeMode="cover"
      />

      <Text style={tw`text-lg font-semibold mb-1`}>{recipe.recipe}</Text>

      <Text style={tw`text-gray-600 mb-1`}>
        Calories: {recipe.calories} kcal
      </Text>

      <Text style={tw`text-gray-600 mb-2`}>
        {recipe.cook_time_in_minutes === 0 ? "Prep time" : "Cooking time"}:{" "}
        {calculateTotalTime()} min
      </Text>

      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-gray-600 mr-2`}>Difficulty:</Text>
          <View style={tw`flex-row`}>
            {Array.from({ length: chefHatCount }).map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={16}
                color="#FFD700"
                style={tw`mr-1`}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={tw`p-2`}>
          <FontAwesome name="heart-o" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
