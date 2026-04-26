import apiClient from "./client";

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
  min_quantity?: number;
  max_quantity?: number;
  nutrition_score?: string;
  expiry_filter?: string;
};

export const inventoryService = {
  getInventoryProducts: async (
    filters: InventoryFilters = {}
  ): Promise<InventoryProduct[]> => {
    try {
      const response = await apiClient.get("/inventory/products", {
        params: {
          search: filters.search?.trim() || undefined,
          categoria: filters.categoria || undefined,
          min_quantity: filters.min_quantity,
          max_quantity: filters.max_quantity,
          nutrition_score: filters.nutrition_score || undefined,
          expiry_filter: filters.expiry_filter || undefined,
        },
      });

      return response.data?.products || [];
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
};