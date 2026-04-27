import { useAuth } from "@/src/context/AuthContext";
import { Tabs } from "expo-router";
import { Home, Package, Settings, Users } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const { hasHome } = useAuth();

  return (
    <Tabs
      screenOptions={{
        // Ocultamos la cabecera nativa porque tus pantallas ya tienen sus propios
        // View personalizados para el Header (ej: "My Fridge", "Settings")
        headerShown: false,

        // Colores de FoodSync
        tabBarActiveTintColor: "#10B981", // Verde primario
        tabBarInactiveTintColor: "#9CA3AF", // text-muted-foreground

        // Estilos del contenedor de la barra
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB", // border-border
          borderTopWidth: 1,
          elevation: 0, // Quita la sombra en Android para que se vea plano como en web
          shadowOpacity: 0, // Quita la sombra en iOS
          // Ajuste dinámico de altura para el "notch" y la barra de inicio del iPhone
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
        },

        // Estilos del textito debajo del icono
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      {/* 1. Pantalla Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          href: hasHome ? "/(tabs)/dashboard" : null, // <-- OCULTA SI ES FALSE
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      {/* 2. Pantalla Inventario */}
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          href: hasHome ? "/(tabs)/inventory" : null, // <-- OCULTA SI ES FALSE
          tabBarIcon: ({ color, focused }) => (
            <Package color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      {/* 3. Pantalla Hogar */}
      <Tabs.Screen
        name="household"
        options={{
          title: "Household",
          tabBarIcon: ({ color, focused }) => (
            <Users color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      {/* 4. Pantalla Ajustes */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Settings color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="products/addManualProducts"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
