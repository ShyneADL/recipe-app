import { View, Text, ScrollView } from "react-native";
import tw from "twrnc";
import { SearchBar, RecipeCard } from "./components";

// Sample data for testing
const sampleRecipes = [
  {
    id: "1",
    recipe: "Keto Chicken Stir Fry",
    image: "https://source.unsplash.com/random/400x300/?food",
    calories: 450,
    cook_time_in_minutes: 20,
    prep_time_in_minutes: 10,
    difficulty: 4,
    category: { category: "Main Dish" },
  },
  {
    id: "2",
    recipe: "Avocado Salad",
    image: "https://source.unsplash.com/random/400x300/?salad",
    calories: 320,
    cook_time_in_minutes: 0,
    prep_time_in_minutes: 15,
    difficulty: 2,
    category: { category: "Salad" },
  },
];

export default function Home() {
  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`px-4 py-6`}>
        <Text style={tw`text-3xl font-bold text-center mb-6`}>
          <Text style={tw`text-red-600`}>Discover</Text>,{" "}
          <Text style={tw`text-red-600`}>Share</Text> and{" "}
          <Text style={tw`text-red-600`}>Connect</Text> with Foodies around the
          world.
        </Text>

        <View style={tw`mb-8`}>
          <SearchBar />
        </View>

        <Text style={tw`text-2xl font-bold mb-4`}>Trending Recipes</Text>
        <View style={tw`flex-row flex-wrap justify-between`}>
          {sampleRecipes.map((recipe) => (
            <View key={recipe.id} style={tw`w-[48%]`}>
              <RecipeCard recipe={recipe} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
