import React from "react";
import { 
  View,
  Text,
  TouchableOpacity 
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView>
      <View className="px-4 pt-6 pb-4">
        <TouchableOpacity
          className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-gray-200"
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
      </View>

      <Text>Login Screen</Text>
    </SafeAreaView>
  );
}
