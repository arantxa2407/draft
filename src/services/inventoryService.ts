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

export const inventoryService = {
  getCategories: async () => {
    try {
      const response = await apiClient.get("/inventory/categories/all");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Error al cargar las categorías";
    }
  },

  createManualProduct: async (productData: CreateProductData) => {
    try {
      const response = await apiClient.post("/inventory/manual", productData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Error al añadir el producto";
    }
  },

  getInventory: async () => {
    try {
      const response = await apiClient.get("/inventory");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Error al cargar el inventario";
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      const response = await apiClient.delete("/inventory_delete_product", {
        data: { product_id: productId },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Error al eliminar el producto";
    }
  },
};
