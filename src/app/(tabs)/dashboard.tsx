import { router, useFocusEffect } from "expo-router";
import {
  AlertCircle,
  Camera,
  ChevronRight,
  Plus,
  ScanBarcode,
} from "lucide-react-native";
import { useCallback } from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const expiringItems = [
  {
    id: "1",
    name: "Organic Milk",
    brand: "Dairy",
    daysLeft: 2,
    image:
      "https://images.unsplash.com/photo-1641320487573-479720290849?q=80&w=200",
    color: "#F0F9FF",
  },
  {
    id: "2",
    name: "Fresh Strawberries",
    brand: "Fruits",
    daysLeft: 1,
    image:
      "https://images.unsplash.com/photo-1543158181-e6f9f6712055?q=80&w=200",
    color: "#FEF2F2",
  },
];

export default function Dashboard() {
  const today = new Date();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Retornar 'true' intercepta la acción y evita que vaya hacia atrás
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Mi nevera</Text>
          <Text className="text-sm text-gray-500 font-medium">
            {today.toLocaleDateString("es-ES", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Stats */}
        <View className="flex-row px-6 gap-3 mt-4">
          <View className="flex-1 p-4 rounded-3xl bg-emerald-50 border border-emerald-100">
            <Text className="text-2xl font-bold text-emerald-700">24</Text>
            <Text className="text-xs text-emerald-600 font-medium mt-1">
              Totales
            </Text>
          </View>
          <View className="flex-1 p-4 rounded-3xl bg-amber-50 border border-amber-100">
            <Text className="text-2xl font-bold text-amber-700">3</Text>
            <Text className="text-xs text-amber-600 font-medium mt-1">
              Venciendo
            </Text>
          </View>
          <View className="flex-1 p-4 rounded-3xl bg-gray-50 border border-gray-100">
            <Text className="text-2xl font-bold text-gray-700">21</Text>
            <Text className="text-xs text-gray-500 font-medium mt-1">
              Fresco
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-8 flex-row gap-3">
          <TouchableOpacity className="flex-1 bg-emerald-500 p-4 rounded-3xl items-center">
            <Camera size={24} color="white" />
            <Text className="text-white text-[10px] font-bold mt-2 text-center">
              Ticket
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-100 p-4 rounded-3xl items-center"
            onPress={() => router.push("/products/scanBarcode")}
          >
            <ScanBarcode size={24} color="#10B981" />
            <Text className="text-gray-900 text-[10px] font-bold mt-2 text-center">
              Barras
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-50 p-4 rounded-3xl items-center border border-gray-100"
            onPress={() => router.push("/products/addManualProducts")}
          >
            <Plus size={24} color="#6B7280" />
            <Text className="text-gray-600 text-[10px] font-bold mt-2 text-center">
              Manual
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expiring Soon */}
        <View className="px-6 mt-8 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <AlertCircle size={20} color="#F59E0B" />
              <Text className="text-lg font-bold text-gray-900">
                Vencen pronto
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-emerald-600 font-bold">Ver todo</Text>
            </TouchableOpacity>
          </View>

          {expiringItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center p-3 rounded-2xl mb-3 border border-gray-100"
              style={{ backgroundColor: item.color }}
            >
              <Image
                source={{ uri: item.image }}
                className="w-14 h-14 rounded-xl bg-white"
              />
              <View className="flex-1 ml-4">
                <Text className="font-bold text-gray-900 text-base">
                  {item.name}
                </Text>
                <Text
                  className={`text-xs font-bold ${item.daysLeft === 1 ? "text-red-600" : "text-amber-600"}`}
                >
                  Queda{item.daysLeft > 1 ? "n" : ""} {item.daysLeft} día
                  {item.daysLeft > 1 ? "s" : ""}
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
