import { View, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search recipes...",
}: SearchBarProps) {
  return (
    <View style={tw`flex-row items-center bg-gray-100 rounded-full px-4 py-2`}>
      <FontAwesome name="search" size={20} color="#666" style={tw`mr-2`} />
      <TextInput
        style={tw`flex-1 text-base`}
        placeholder={placeholder}
        placeholderTextColor="#666"
        onChangeText={onSearch}
      />
      <TouchableOpacity style={tw`p-2`}>
        <FontAwesome name="filter" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
}
