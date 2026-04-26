import { useFocusEffect } from "@react-navigation/native";
import {
  ChevronDown,
  Package,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  inventoryService,
  type InventoryCategoryOption,
  type InventoryProduct,
} from "../../services/inventoryService";

const NUTRITION_OPTIONS = ["A", "B", "C", "D", "E"];
const EXPIRY_OPTIONS = [
  { label: "Próximos", value: "expiring_soon" },
  { label: "Caducados", value: "expired" },
  { label: "OK", value: "ok" },
];

export default function InventoryScreen() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [categories, setCategories] = useState<InventoryCategoryOption[]>([]);

  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [nutritionScore, setNutritionScore] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchInventory = async (overrideSearch?: string) => {
    try {
      setLoading(true);
      setError("");

      const data = await inventoryService.getInventoryProducts({
        search: overrideSearch ?? search,
        categoria,
        min_quantity: minQuantity ? Number(minQuantity) : undefined,
        max_quantity: maxQuantity ? Number(maxQuantity) : undefined,
        nutrition_score: nutritionScore || undefined,
        expiry_filter: expiryFilter || undefined,
      });

      setProducts(data);
    } catch (err: any) {
      setError(
        typeof err === "string" ? err : "No se pudo cargar el inventario"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await inventoryService.getCategories();
      setCategories(data);
    } finally {
      setLoadingCategories(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInventory();
      fetchCategories();
    }, [])
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchInventory(search);
    }, 350);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  const applyFilters = () => {
    fetchInventory();
  };

  const clearFilters = async () => {
    setSearch("");
    setCategoria("");
    setMinQuantity("");
    setMaxQuantity("");
    setNutritionScore("");
    setExpiryFilter("");

    try {
      setLoading(true);
      setError("");
      const data = await inventoryService.getInventoryProducts();
      setProducts(data);
    } catch (err: any) {
      setError(
        typeof err === "string" ? err : "No se pudo cargar el inventario"
      );
    } finally {
      setLoading(false);
    }
  };

  const activeFiltersCount =
    (categoria ? 1 : 0) +
    (minQuantity ? 1 : 0) +
    (maxQuantity ? 1 : 0) +
    (nutritionScore ? 1 : 0) +
    (expiryFilter ? 1 : 0);

  const selectedCategoryLabel = categoria || "Todas las categorías";

  const renderSubtitle = (product: InventoryProduct) => {
    const parts = [];

    if (product.categoria) parts.push(product.categoria);
    parts.push(`Cantidad: ${product.quantitat}`);

    if (product.data_caducitat) {
      parts.push(`Caduca: ${product.data_caducitat}`);
    }

    return parts.join(" · ");
  };

  const renderItem = ({ item }: { item: InventoryProduct }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-xl bg-emerald-50 items-center justify-center mr-4">
          <Package color="#10B981" size={22} />
        </View>

        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">{item.nom}</Text>

          <Text className="text-sm text-gray-500 mt-1">
            {renderSubtitle(item)}
          </Text>

          {item.es_privat ? (
            <Text className="text-xs text-amber-600 mt-1 font-medium">
              Producto privado
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  const Chip = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
        selected
          ? "bg-emerald-500 border-emerald-500"
          : "bg-white border-gray-300"
      }`}
    >
      <Text className={selected ? "text-white font-medium" : "text-gray-700"}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Inventario</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Consulta todos los productos de tu hogar
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4">
          <View className="bg-white border border-gray-200 rounded-2xl px-4 h-12 flex-row items-center">
            <Search color="#9CA3AF" size={18} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar producto..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-900"
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <X color="#9CA3AF" size={18} />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            className="mt-3 flex-row items-center justify-center bg-white border border-gray-200 rounded-2xl h-11"
            onPress={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal color="#4B5563" size={18} />
            <Text className="ml-2 text-gray-700 font-medium">
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              {activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
            </Text>
          </TouchableOpacity>

          {showFilters ? (
            <View className="mt-3 bg-white border border-gray-200 rounded-2xl p-4">
              <Text className="text-sm font-medium text-gray-900 mb-2">
                Categoría
              </Text>

              {loadingCategories ? (
                <ActivityIndicator size="small" color="#10B981" />
              ) : (
                <TouchableOpacity
                  className="h-12 px-4 rounded-xl bg-gray-100 flex-row items-center justify-between mb-3"
                  onPress={() => setShowCategoryModal(true)}
                >
                  <Text
                    className={
                      categoria
                        ? "text-gray-900 text-base"
                        : "text-gray-400 text-base"
                    }
                  >
                    {selectedCategoryLabel}
                  </Text>
                  <ChevronDown color="#6B7280" size={20} />
                </TouchableOpacity>
              )}

              <Text className="text-sm font-medium text-gray-900 mb-2">
                Stock
              </Text>

              <View className="flex-row mb-3">
                <TextInput
                  value={minQuantity}
                  onChangeText={setMinQuantity}
                  placeholder="Mín."
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  className="flex-1 h-12 px-4 rounded-xl bg-gray-100 text-base text-gray-900 mr-2"
                />
                <TextInput
                  value={maxQuantity}
                  onChangeText={setMaxQuantity}
                  placeholder="Máx."
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  className="flex-1 h-12 px-4 rounded-xl bg-gray-100 text-base text-gray-900 ml-2"
                />
              </View>

              <Text className="text-sm font-medium text-gray-900 mb-2">
                Scoring nutricional
              </Text>

              <View className="flex-row flex-wrap mb-3">
                {NUTRITION_OPTIONS.map((score) => (
                  <Chip
                    key={score}
                    label={score}
                    selected={nutritionScore === score}
                    onPress={() =>
                      setNutritionScore((prev) => (prev === score ? "" : score))
                    }
                  />
                ))}
              </View>

              <Text className="text-sm font-medium text-gray-900 mb-2">
                Proximidad de caducidad
              </Text>

              <View className="flex-row flex-wrap">
                {EXPIRY_OPTIONS.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    selected={expiryFilter === option.value}
                    onPress={() =>
                      setExpiryFilter((prev) =>
                        prev === option.value ? "" : option.value
                      )
                    }
                  />
                ))}
              </View>

              <View className="flex-row mt-4">
                <TouchableOpacity
                  className="flex-1 h-11 bg-emerald-500 rounded-xl items-center justify-center mr-2"
                  onPress={applyFilters}
                >
                  <Text className="text-white font-semibold">Aplicar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-11 bg-gray-200 rounded-xl items-center justify-center ml-2"
                  onPress={clearFilters}
                >
                  <Text className="text-gray-700 font-semibold">Limpiar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>

        <View className="px-6 pt-4">
          {loading ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-gray-500 mt-4">Cargando inventario...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center px-6 py-16">
              <Text className="text-red-500 text-center font-medium">
                {error}
              </Text>
              <TouchableOpacity
                className="mt-4 bg-emerald-500 px-5 py-3 rounded-xl"
                onPress={applyFilters}
              >
                <Text className="text-white font-semibold">Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : products.length === 0 ? (
            <View className="items-center justify-center px-6 py-16">
              <View className="w-20 h-20 rounded-full bg-emerald-50 items-center justify-center mb-4">
                <Package color="#10B981" size={30} />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-2">
                No hay productos
              </Text>
              <Text className="text-gray-500 text-center">
                No se encontraron productos con esos filtros.
              </Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id_producte}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/30 justify-center px-6"
          onPress={() => setShowCategoryModal(false)}
        >
          <Pressable className="bg-white rounded-2xl p-4 max-h-[70%]">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Selecciona una categoría
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                className="py-3 border-b border-gray-100"
                onPress={() => {
                  setCategoria("");
                  setShowCategoryModal(false);
                }}
              >
                <Text className="text-base text-gray-900">
                  Todas las categorías
                </Text>
              </TouchableOpacity>

              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  className="py-3 border-b border-gray-100"
                  onPress={() => {
                    setCategoria(cat.label);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      categoria === cat.label
                        ? "text-emerald-600 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}