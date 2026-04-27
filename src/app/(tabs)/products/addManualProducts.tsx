import { router, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  CheckSquare,
  ChevronDown,
  Lock,
  Square,
  Unlock,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import DatePickerField from "../../../components/products/DatePickerField";
import SearchablePicker from "../../../components/products/SearchablePicker";
import { useAuth } from "../../../context/AuthContext";
import { inventoryService } from "../../../services/inventoryService";

export default function AddManualProductScreen() {
  const { session } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  const [isPrivate, setIsPrivate] = useState(false);
  const [isBoughtToday, setIsBoughtToday] = useState(false);

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const toggleBoughtToday = () => {
    const newValue = !isBoughtToday;
    setIsBoughtToday(newValue);
    if (newValue) {
      setPurchaseDate(new Date());
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, []),
  );

  const loadCategories = async () => {
    try {
      const data = await inventoryService.getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (data && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error: any) {
      Alert.alert("Error", error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !selectedCategory ||
      !price ||
      !quantity ||
      !purchaseDate
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, rellena los campos obligatorios.",
      );
      return;
    }

    const parsedPrice = parseFloat(price.replace(",", "."));
    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert("Precio inválido", "El precio debe ser un número positivo.");
      return;
    }

    if (isNaN(parsedQuantity) || parsedQuantity <= 0 || parsedQuantity > 99) {
      Alert.alert("Cantidad inválida", "La cantidad debe estar entre 1 y 99.");
      return;
    }

    setIsSubmitting(true);
    try {
      const roundedPrice = Math.round(parsedPrice * 100) / 100;

      await inventoryService.createManualProduct({
        nom: name.trim(),
        categoria: selectedCategory.value,
        preu: roundedPrice,
        quantitat: parsedQuantity,
        data_compra: purchaseDate
          ? purchaseDate.toISOString().split("T")[0]
          : undefined,
        data_caducitat: expirationDate
          ? expirationDate.toISOString().split("T")[0]
          : undefined,
        id_propietaris_privats: isPrivate && session?.id ? [session.id] : [],
      });

      Alert.alert("¡Éxito!", "Producto añadido correctamente.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/dashboard") },
      ]);
    } catch (error: any) {
      Alert.alert("Error al guardar", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <SearchablePicker
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={setSelectedCategory}
        options={categories}
        title="Categoría del producto"
      />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center px-4 pb-4 border-b border-gray-200">
          <TouchableOpacity
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-gray-200"
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <ArrowLeft color="#1F2937" size={24} />
          </TouchableOpacity>
        </View>

        <View className="px-6 space-y-6">
          <View className="items-left gap-2 my-4">
            <Text className="text-2xl font-bold text-gray-900 ">
              Añade producto manualmente
            </Text>
            <Text className="text-sm text-gray-500 font-medium">
              Añade los detalles del producto.
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="font-medium text-gray-900 mb-2">
              Nombre del producto <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 px-4 rounded-2xl bg-white border border-gray-200 text-base shadow-sm"
              value={name}
              onChangeText={setName}
              placeholder="Ej: Llet organica"
              placeholderTextColor="#9CA3AF"
              maxLength={100}
            />
          </View>

          <View className="flex-row gap-4 mt-4">
            <View className="flex-1 space-y-2">
              <Text className="font-medium text-gray-900 mb-2">
                Categoría <Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                className="h-14 px-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex-row items-center justify-between"
                onPress={() => setIsPickerVisible(true)}
                disabled={isLoadingCategories}
              >
                <View className="flex-row items-center">
                  {isLoadingCategories ? (
                    <Text className="text-gray-400 text-base">Cargando...</Text>
                  ) : (
                    <Text
                      className={`text-base pr-2 ${selectedCategory ? "text-gray-900" : "text-gray-400"}`}
                      numberOfLines={1}
                    >
                      {selectedCategory
                        ? selectedCategory.label
                        : "Seleccionar..."}
                    </Text>
                  )}
                </View>
                {isLoadingCategories ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <ChevronDown color="#9CA3AF" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-1 space-y-2">
              <Text className="font-medium text-gray-900 mb-2">
                Precio (€) <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="h-14 px-4 rounded-2xl bg-white border border-gray-200 text-base shadow-sm"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          <View className="flex-row gap-4 mt-4">
            <View className="flex-1 space-y-2">
              <Text className="font-medium text-gray-900 mb-2">
                Cantidad <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="h-14 px-4 rounded-2xl bg-white border border-gray-200 text-base shadow-sm"
                placeholder="1"
                keyboardType="number-pad"
                value={quantity}
                onChangeText={setQuantity}
                maxLength={2}
              />
            </View>

            <View className="flex-1">
              <DatePickerField
                label="Fecha Compra"
                value={purchaseDate}
                onChange={setPurchaseDate}
                placeholder="Opcional"
                minimumDate={oneWeekAgo}
                maximumDate={today}
                disabled={isBoughtToday}
                isRequired={true}
              />
              <TouchableOpacity
                className="flex-row items-center mt-3 ml-1"
                onPress={toggleBoughtToday}
              >
                {isBoughtToday ? (
                  <CheckSquare color="#10B981" size={20} />
                ) : (
                  <Square color="#9CA3AF" size={20} />
                )}
                <Text className="ml-2 text-sm text-gray-700 font-medium">
                  Comprado hoy
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row gap-4 mt-4">
            <View className="flex-1">
              <DatePickerField
                label="Fecha Caducidad"
                value={expirationDate}
                onChange={setExpirationDate}
                placeholder="Sin caducidad (Opcional)"
                minimumDate={today}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between p-4 mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <View className="flex-row items-center flex-1">
              <View
                className={`p-2 rounded-xl mr-3 ${isPrivate ? "bg-amber-100" : "bg-gray-100"}`}
              >
                {isPrivate ? (
                  <Lock color="#D97706" size={20} />
                ) : (
                  <Unlock color={isPrivate ? "#D97706" : "#9CA3AF"} size={20} />
                )}
              </View>
              <View className="flex-1 pr-4">
                <Text className="text-base font-bold text-gray-900">
                  Producto privado
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#10B981" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#E5E7EB"
              onValueChange={setIsPrivate}
              value={isPrivate}
            />
          </View>

          <TouchableOpacity
            className={`w-full h-14 rounded-2xl flex items-center justify-center mt-8 shadow-sm ${
              isSubmitting
                ? "bg-emerald-300"
                : "bg-emerald-500 active:bg-emerald-600"
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Guardar producto
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
