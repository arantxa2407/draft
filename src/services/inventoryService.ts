import apiClient from "./client";

export interface CreateProductData {
  nom: string;
  categoria: string;
  preu: number;
  quantitat: number;
  data_compra?: string;
  data_caducitat?: string;
  id_propietaris_privats?: string[];
}

export type InventoryOwner = {
  id_usuari: string;
  nom: string;
};

export type InventoryProduct = {
  id_producte: string;
  nom: string;
  quantitat: number;
  categoria: string;
  data_caducitat?: string | null;
  es_privat: boolean;
  propietaris: InventoryOwner[];
};

export type InventoryCategoryOption = {
  value: string;
  label: string;
};

export type InventoryFilters = {
  search?: string;
  categoria?: string;
  owner_user_id?: string;
  min_quantity?: number;
  max_quantity?: number;
  nutrition_score?: string;
  expiry_filter?: string;
};

export type InventoryNutrition = {
  energy_kcal?: number | null;
  fat?: number | null;
  saturated_fat?: number | null;
  carbohydrates?: number | null;
  sugars?: number | null;
  fiber?: number | null;
  proteins?: number | null;
  salt?: number | null;
  sodium?: number | null;
};

export type InventoryProductDetail = {
  id_producte: string;
  nom: string;
  marca?: string | null;
  quantitat_stock: number;
  quantitat_envas?: string | null;
  categoria?: string | null;
  data_caducitat?: string | null;
  data_compra?: string | null;
  preu?: string | null;
  es_privat: boolean;
  propietaris: InventoryOwner[];
  estat_stock: string;
  nutriscore?: string | null;
  informacio_nutricional_100g_ml?: InventoryNutrition | null;
  ingredients?: string | null;
  allergens?: string | null;
  imatge_url?: string | null;
};

export const inventoryService = {
  createManualProduct: async (productData: CreateProductData) => {
    try {
      const response = await apiClient.post("/inventory/manual", productData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Error al añadir el producto";
    }
  },

  getInventoryProducts: async (
    filters: InventoryFilters = {},
  ): Promise<InventoryProduct[]> => {
    try {
      const response = await apiClient.get("/inventory", {
        params: {
          search: filters.search?.trim() || undefined,
          categoria: filters.categoria || undefined,
          owner_user_id: filters.owner_user_id || undefined,
          min_quantity: filters.min_quantity,
          max_quantity: filters.max_quantity,
          nutrition_score: filters.nutrition_score || undefined,
          expiry_filter: filters.expiry_filter || undefined,
        },
      });

      return response.data?.products || response.data?.productes || [];
    } catch (error: any) {
      throw error.response?.data?.detail || "No se pudo cargar el inventario";
    }
  },

  getCategories: async (): Promise<InventoryCategoryOption[]> => {
    try {
      const response = await apiClient.get("/inventory/categories/all");

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response.data?.categories)) {
        return response.data.categories;
      }

      return [];
    } catch {
      return [];
    }
  },

  getInventoryProductDetail: async (
    productId: string,
  ): Promise<InventoryProductDetail> => {
    try {
      const response = await apiClient.get(`/inventory/${productId}`);
      return response.data?.producte;
    } catch (error: any) {
      throw error.response?.data?.detail || "No se pudo cargar el producto";
    }
  },

  updateProductQuantity: async (id_producte: string, modificacio: number) => {
    try {
      const response = await apiClient.patch("/inventory_modify", {
        id_producte,
        modificacio,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "No se pudo modificar la cantidad";
    }
  },

  deleteProduct: async (id_producte: string) => {
    try {
      const response = await apiClient.delete("/inventory_delete_product", {
        data: { id_producte },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "No se pudo eliminar el producto";
    }
  },
};
