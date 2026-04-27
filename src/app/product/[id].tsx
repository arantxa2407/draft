import { router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    CircleAlert,
    Package,
    ShieldCheck,
    Tag,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    inventoryService,
    type InventoryProductDetail,
} from "../../services/inventoryService";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<InventoryProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      if (!id) return;

      const data = await inventoryService.getInventoryProductDetail(id);
      setProduct(data);
    } catch (err: any) {
      setError(typeof err === "string" ? err : "No se pudo cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <View className="py-3 border-b border-gray-100">
      <Text className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </Text>
      <Text className="text-base text-gray-900">
        {value !== null && value !== undefined && value !== ""
          ? String(value)
          : "No disponible"}
      </Text>
    </View>
  );

  const ownersText =
    product?.propietaris && product.propietaris.length > 0
      ? product.propietaris.map((owner) => owner.nom).join(", ")
      : "No disponible";

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <View className="px-4 pt-6 pb-4 bg-white border-b border-gray-200">
        <TouchableOpacity
          className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-gray-200"
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-500 mt-4">Cargando producto...</Text>
        </View>
      ) : error || !product ? (
        <View className="flex-1 items-center justify-center px-6">
          <CircleAlert color="#ef4444" size={28} />
          <Text className="text-red-500 text-center font-medium mt-3">
            {error || "No se pudo cargar el producto"}
          </Text>

          <TouchableOpacity
            className="mt-4 bg-emerald-500 px-5 py-3 rounded-xl"
            onPress={fetchProduct}
          >
            <Text className="text-white font-semibold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
            <View className="flex-row items-start">
              <View className="w-16 h-16 rounded-2xl bg-emerald-50 items-center justify-center mr-4">
                {product.imatge_url ? (
                  <Image
                    source={{ uri: product.imatge_url }}
                    className="w-16 h-16 rounded-2xl"
                    resizeMode="cover"
                  />
                ) : (
                  <Package color="#10B981" size={28} />
                )}
              </View>

              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900">
                  {product.nom}
                </Text>

                <Text className="text-gray-500 mt-1">
                  {product.marca || "Marca no disponible"}
                </Text>

                <View className="flex-row flex-wrap mt-3">
                  <View className="bg-emerald-50 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-emerald-700 font-medium">
                      Stock: {product.quantitat_stock}
                    </Text>
                  </View>

                  <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-gray-700 font-medium">
                      {product.estat_stock}
                    </Text>
                  </View>

                  {product.nutriscore ? (
                    <View className="bg-amber-50 px-3 py-1 rounded-full mr-2 mb-2">
                      <Text className="text-amber-700 font-medium">
                        Nutri-score: {product.nutriscore}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Información general
            </Text>

            <InfoRow label="Categoría" value={product.categoria} />
            <InfoRow label="Cantidad envase" value={product.quantitat_envas} />
            <InfoRow label="Fecha de compra" value={product.data_compra} />
            <InfoRow label="Fecha de caducidad" value={product.data_caducitat} />
            <InfoRow label="Precio" value={product.preu} />
          </View>

          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Propiedad y acceso
            </Text>

            <View className="flex-row items-center mb-3">
              <ShieldCheck color={product.es_privat ? "#D97706" : "#10B981"} size={18} />
              <Text className="ml-2 text-base text-gray-900">
                {product.es_privat ? "Producto privado" : "Producto compartido"}
              </Text>
            </View>

            <View className="flex-row items-start">
              <Tag color="#6B7280" size={18} />
              <Text className="ml-2 text-base text-gray-900 flex-1">
                {ownersText}
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Ingredientes
            </Text>
            <Text className="text-base text-gray-700">
              {product.ingredients || "No disponible"}
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Alérgenos
            </Text>
            <Text className="text-base text-gray-700">
              {product.allergens || "No disponible"}
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Información nutricional (100g/ml)
            </Text>

            <InfoRow
              label="Energía (kcal)"
              value={product.informacio_nutricional_100g_ml?.energy_kcal}
            />
            <InfoRow
              label="Grasas"
              value={product.informacio_nutricional_100g_ml?.fat}
            />
            <InfoRow
              label="Grasas saturadas"
              value={product.informacio_nutricional_100g_ml?.saturated_fat}
            />
            <InfoRow
              label="Carbohidratos"
              value={product.informacio_nutricional_100g_ml?.carbohydrates}
            />
            <InfoRow
              label="Azúcares"
              value={product.informacio_nutricional_100g_ml?.sugars}
            />
            <InfoRow
              label="Fibra"
              value={product.informacio_nutricional_100g_ml?.fiber}
            />
            <InfoRow
              label="Proteínas"
              value={product.informacio_nutricional_100g_ml?.proteins}
            />
            <InfoRow
              label="Sal"
              value={product.informacio_nutricional_100g_ml?.salt}
            />
            <InfoRow
              label="Sodio"
              value={product.informacio_nutricional_100g_ml?.sodium}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}