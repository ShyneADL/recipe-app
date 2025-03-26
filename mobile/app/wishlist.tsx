import { View, Text } from "react-native";
import tw from "twrnc";

export default function Wishlist() {
  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>My Wishlist</Text>
    </View>
  );
}
