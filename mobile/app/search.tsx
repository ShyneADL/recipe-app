import { View, Text } from "react-native";
import tw from "twrnc";

export default function Search() {
  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Search Recipes</Text>
    </View>
  );
}
