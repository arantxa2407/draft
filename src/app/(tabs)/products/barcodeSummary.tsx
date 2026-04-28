import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Check,
  CheckSquare,
  Edit3,
  Lock,
  Package,
  Square,
  Unlock,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DatePickerField from "../../../components/products/DatePickerField";
import { useAuth } from "../../../context/AuthContext";
import { inventoryService } from "../../../services/inventoryService";

export default function BarcodeSummaryScreen() {
  const { barcode } = useLocalSearchParams();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isBoughtToday, setIsBoughtToday] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const toggleBoughtToday = () => {
    setIsBoughtToday(!isBoughtToday);
    if (!isBoughtToday) setPurchaseDate(new Date());
  };

  useEffect(() => {
    loadProductData();
  }, [barcode]);

  const loadProductData = async () => {
    try {
      const result = await inventoryService.lookupBarcode(barcode as string);
      setProduct(result.product);
    } catch (error) {
      Alert.alert(
        "Error",
        "No s'ha pogut carregar la informació del producte.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      Alert.alert("Dades incompletes", "La quantitat ha de ser almenys 1.");
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryService.confirmBarcodeProduct({
        barcode: barcode as string,
        nom: product?.nom,
        categoria: product?.categoria,
        quantitat: parseInt(quantity, 10),
        preu: price ? parseFloat(price.replace(",", ".")) : undefined,
        data_compra: purchaseDate?.toISOString().split("T")[0],
        data_caducitat: expirationDate?.toISOString().split("T")[0],
        id_propietaris_privats: isPrivate && session?.id ? [session.id] : [],
      });
      Alert.alert("¡Èxit!", "Producte afegit a l'inventari.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/inventory") },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/products/addManualProducts",
      params: {
        prefill: JSON.stringify({
          ...product,
          barcode: barcode,
          price: price,
          quantity: quantity,
        }),
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAF8]">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {/* Cabecera, respetando el inset superior */}
      <View
        className="flex-row items-center px-4 py-2"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 ml-2 text-center flex-1 pr-10">
          Resum del producte
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Card de Imagen/Icono */}
        <View className="bg-white rounded-[32px] p-8 items-center shadow-sm border border-gray-100 mb-6">
          {product?.imatge_url ? (
            <Image
              source={{ uri: product.imatge_url }}
              className="w-48 h-48 rounded-2xl"
              resizeMode="contain"
            />
          ) : (
            <View className="w-48 h-48 bg-emerald-50 rounded-3xl items-center justify-center">
              <Package color="#10B981" size={80} />
            </View>
          )}
        </View>

        {/* Detalles del Producto */}
        <View className="space-y-4 mb-10">
          <View>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Nom
            </Text>
            <Text className="text-2xl font-bold text-gray-900">
              {product?.nom || "Producte desconegut"}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Marca
              </Text>
              <Text className="text-lg font-medium text-gray-700">
                {product?.marca || "Genèrica"}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Categoria
              </Text>
              <Text className="text-lg font-medium text-emerald-600">
                {product?.categoria || "Sense categoria"}
              </Text>
            </View>
          </View>

          {/* Formulario de ajuste rápido */}
          <View className="flex-row gap-4">
            <View className="flex-1 space-y-2">
              <Text className="font-medium text-gray-900">Preu (€)</Text>
              <TextInput
                className="h-14 px-4 rounded-2xl bg-white border border-gray-200 text-base"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>
            <View className="flex-1 space-y-2">
              <Text className="font-medium text-gray-900">Quantitat</Text>
              <TextInput
                className="h-14 px-4 rounded-2xl bg-white border border-gray-200 text-base"
                placeholder="1"
                keyboardType="number-pad"
                value={quantity}
                onChangeText={setQuantity}
                maxLength={2}
              />
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <DatePickerField
                label="Data Compra"
                value={purchaseDate}
                onChange={setPurchaseDate}
                disabled={isBoughtToday}
                maximumDate={today}
                minimumDate={oneWeekAgo}
              />
              <TouchableOpacity
                className="flex-row items-center mt-2 ml-1"
                onPress={toggleBoughtToday}
              >
                {isBoughtToday ? (
                  <CheckSquare color="#10B981" size={18} />
                ) : (
                  <Square color="#9CA3AF" size={18} />
                )}
                <Text className="ml-2 text-xs text-gray-600 font-medium">
                  Comprat avui
                </Text>
              </TouchableOpacity>
            </View>
            <DatePickerField
              label="Caducitat"
              value={expirationDate}
              onChange={setExpirationDate}
              placeholder="Opcional"
              minimumDate={today}
            />
          </View>

          {/* Privacidad */}
          <View className="flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl mt-2">
            <View className="flex-row items-center">
              <View
                className={`p-2 rounded-xl mr-3 ${isPrivate ? "bg-amber-100" : "bg-gray-100"}`}
              >
                {isPrivate ? (
                  <Lock color="#D97706" size={20} />
                ) : (
                  <Unlock color="#9CA3AF" size={20} />
                )}
              </View>
              <Text className="text-base font-bold text-gray-900">Privat</Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            />
          </View>
        </View>

        <Text className="text-center text-gray-500 font-medium mb-6">
          Aquesta informació és correcta?
        </Text>
      </ScrollView>

      {/* Botones de Acción*/}
      <View
        className="px-6 pt-4 bg-white rounded-t-[32px] shadow-lg border-t border-gray-100"
        style={{ paddingBottom: Math.max(insets.bottom + 10, 24) }}
      >
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={isSubmitting}
          className="bg-emerald-500 h-16 rounded-2xl flex-row items-center justify-center mb-3"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Check color="white" size={20} strokeWidth={3} />
              <Text className="text-white font-bold text-lg ml-2">
                Sí, és correcte
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleEdit}
          className="bg-gray-100 h-16 rounded-2xl flex-row items-center justify-center"
        >
          <Edit3 color="#4B5563" size={20} />
          <Text className="text-gray-600 font-bold text-lg ml-2">
            No, modificar dades
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
