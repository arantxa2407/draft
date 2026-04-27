import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CircleAlert,
  Package,
  ShieldCheck,
  Tag,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

  const [updatingQuantity, setUpdatingQuantity] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);

  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProduct = async (showLoader = true) => {
    try {
      if (!id) return;

      if (showLoader) setLoading(true);
      setError("");

      const data = await inventoryService.getInventoryProductDetail(String(id));
      setProduct(data);
    } catch (err: any) {
      setError(typeof err === "string" ? err : "No se pudo cargar el producto");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(true);
  }, [id]);

  useEffect(() => {
    return () => {
      stopContinuousUpdate();
    };
  }, []);

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return "Sin stock";
    if (quantity <= 2) return "Stock bajo";
    return "En stock";
  };

  const handleUpdateQuantity = async (delta: number) => {
    if (!product || !id || updatingQuantity || deletingProduct) return;

    const currentQuantity = product.quantitat_stock ?? 0;

    if (delta < 0 && currentQuantity <= 0) return;

    try {
      setUpdatingQuantity(true);

      const response = await inventoryService.updateProductQuantity(
        String(id),
        delta
      );

      const backendQuantity =
        response?.producte?.quantitat_restant ??
        response?.product?.quantitat_restant ??
        response?.quantitat_restant;

      if (typeof backendQuantity === "number") {
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                quantitat_stock: backendQuantity,
                estat_stock: getStockStatus(backendQuantity),
              }
            : prev
        );
      } else {
        await fetchProduct(false);
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        typeof err === "string"
          ? err
          : "No se pudo actualizar la cantidad"
      );
    } finally {
      setUpdatingQuantity(false);
    }
  };

  const stopContinuousUpdate = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const startContinuousUpdate = (delta: number) => {
    if (!product || updatingQuantity || deletingProduct) return;
    if (delta < 0 && (product.quantitat_stock ?? 0) <= 0) return;

    stopContinuousUpdate();

    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        handleUpdateQuantity(delta);
      }, 250);
    }, 350);
  };

  const handleDeleteProduct = () => {
    if (!product || deletingProduct || updatingQuantity) return;

    Alert.alert(
      "Eliminar producto",
      `¿Seguro que quieres eliminar "${product.nom}" del inventario?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingProduct(true);
              await inventoryService.deleteProduct(String(id));
              router.back();
            } catch (err: any) {
              Alert.alert(
                "Error",
                typeof err === "string"
                  ? err
                  : "No se pudo eliminar el producto"
              );
              setDeletingProduct(false);
            }
          },
        },
      ]
    );
  };

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
          className="w-10 h-10 rounded-xl items-center justify-center"
          onPress={() => router.back()}
          disabled={updatingQuantity || deletingProduct}
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
          <CircleAlert color="#EF4444" size={28} />
          <Text className="text-red-500 text-center font-medium mt-3">
            {error || "No se pudo cargar el producto"}
          </Text>

          <TouchableOpacity
            className="mt-4 bg-emerald-500 px-5 py-3 rounded-xl"
            onPress={() => fetchProduct(true)}
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
              <View className="w-20 h-20 rounded-2xl bg-emerald-50 items-center justify-center mr-4">
                {product.imatge_url ? (
                  <Image
                    source={{ uri: product.imatge_url }}
                    className="w-20 h-20 rounded-2xl"
                    resizeMode="cover"
                  />
                ) : (
                  <Package color="#10B981" size={34} />
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

            <View className="mt-3 pt-3 border-t border-gray-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-[14px] font-semibold text-gray-900">
                  Modificar cantidad
                </Text>

                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="w-9 h-9 rounded-lg items-center justify-center bg-gray-100"
                    onPress={() => handleUpdateQuantity(-1)}
                    onPressIn={() => startContinuousUpdate(-1)}
                    onPressOut={stopContinuousUpdate}
                    disabled={
                      updatingQuantity ||
                      deletingProduct ||
                      (product.quantitat_stock ?? 0) <= 0
                    }
                  >
                    {updatingQuantity ? (
                      <ActivityIndicator size="small" color="#6B7280" />
                    ) : (
                      <Text className="text-[20px] font-bold text-gray-700">
                        -
                      </Text>
                    )}
                  </TouchableOpacity>

                  <View className="mx-3 min-w-[20px] items-center">
                    <Text className="text-[18px] font-bold text-gray-900">
                      {product.quantitat_stock}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className={`w-9 h-9 rounded-lg items-center justify-center ${
                      updatingQuantity || deletingProduct
                        ? "bg-emerald-300"
                        : "bg-emerald-500"
                    }`}
                    onPress={() => handleUpdateQuantity(1)}
                    onPressIn={() => startContinuousUpdate(1)}
                    onPressOut={stopContinuousUpdate}
                    disabled={updatingQuantity || deletingProduct}
                  >
                    {updatingQuantity ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-[20px] font-bold text-white">
                        +
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className={`mt-3 h-10 rounded-lg flex-row items-center justify-center ${
                  deletingProduct ? "bg-red-400" : "bg-red-500"
                }`}
                onPress={handleDeleteProduct}
                disabled={deletingProduct || updatingQuantity}
              >
                {deletingProduct ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Trash2 color="#FFFFFF" size={16} />
                    <Text className="text-white font-bold text-sm ml-2">
                      Eliminar producto
                    </Text>
                  </>
                )}
              </TouchableOpacity>
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
              <ShieldCheck
                color={product.es_privat ? "#D97706" : "#10B981"}
                size={18}
              />
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