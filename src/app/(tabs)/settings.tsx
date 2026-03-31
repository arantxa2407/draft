import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
  Smartphone,
  Trash2,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock data del usuario
  const user = {
    name: "Usuario",
    email: "usuario@gmail.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  };

  const handleLogout = () => {
    // Aquí iría tu lógica de limpiar el token/sesión
    router.replace("/(auth)/login");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro? Se borrarán todos tus datos del inventario y hogares compartidos. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: () => {
            // Aquí iría tu llamada a la API para borrar la cuenta
            router.replace("/(auth)/register");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      {/* Cabecera */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Ajustes</Text>
      </View>

      {/* Contenido principal scrolleable */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de Perfil */}
        <TouchableOpacity className="flex-row items-center gap-4 bg-white p-4 rounded-2xl mb-8 shadow-sm border border-gray-100">
          <Image
            source={{ uri: user.avatar }}
            className="w-16 h-16 rounded-full bg-gray-200"
          />
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-900">{user.name}</Text>
            <Text className="text-sm text-gray-500">{user.email}</Text>
          </View>
          <ChevronRight color="#9CA3AF" size={24} />
        </TouchableOpacity>

        {/* Sección: Cuenta */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3 px-1">Cuenta</Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <SettingsItem
              icon={<User color="#6B7280" size={20} />}
              label="Información del perfil"
            />
            <SettingsItem
              icon={<Shield color="#6B7280" size={20} />}
              label="Privacidad y seguridad"
            />
            <SettingsItem
              icon={<Globe color="#6B7280" size={20} />}
              label="Idioma"
              value="Español"
              isLast
            />
          </View>
        </View>

        {/* Sección: Notificaciones */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3 px-1">
            Notificaciones
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <SettingsToggle
              icon={<Bell color="#6B7280" size={20} />}
              label="Notificaciones Push"
              description="Recibe avisos en este dispositivo"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <SettingsToggle
              icon={<Bell color="#6B7280" size={20} />}
              label="Alertas de caducidad"
              description="Avisos antes de que los alimentos caduquen"
              checked={expirationAlerts}
              onCheckedChange={setExpirationAlerts}
              disabled={!notificationsEnabled}
            />
            <SettingsToggle
              icon={<Bell color="#6B7280" size={20} />}
              label="Alertas de bajo stock"
              description="Avisos de productos que se agotan"
              checked={lowStockAlerts}
              onCheckedChange={setLowStockAlerts}
              disabled={!notificationsEnabled}
              isLast
            />
          </View>
        </View>

        {/* Sección: Apariencia */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3 px-1">
            Apariencia
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <SettingsToggle
              icon={<Moon color="#6B7280" size={20} />}
              label="Modo oscuro"
              description="Cambiar al tema oscuro"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              isLast
            />
          </View>
        </View>

        {/* Sección: Aplicación */}
        <View className="mb-8">
          <Text className="font-semibold text-gray-900 mb-3 px-1">
            Aplicación
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <SettingsItem
              icon={<Smartphone color="#6B7280" size={20} />}
              label="Versión de la app"
              value="1.0.0"
              hideChevron
            />
            <SettingsItem
              icon={<HelpCircle color="#6B7280" size={20} />}
              label="Ayuda y soporte"
            />
            <SettingsItem
              icon={<FileText color="#6B7280" size={20} />}
              label="Términos y privacidad"
              isLast
            />
          </View>
        </View>

        {/* Botones de Peligro (Cerrar sesión y Eliminar cuenta) */}
        <View className="space-y-4 gap-4">
          <TouchableOpacity
            className="w-full flex-row items-center justify-center h-14 bg-white border border-red-200 rounded-2xl shadow-sm active:bg-red-50"
            onPress={handleLogout}
          >
            <LogOut color="#ef4444" size={20} />
            <Text className="text-red-500 font-semibold text-base ml-2">
              Cerrar sesión
            </Text>
          </TouchableOpacity>

          {/* Botón de eliminar cuenta añadido */}
          <TouchableOpacity
            className="w-full flex-row items-center justify-center h-14 bg-red-50 rounded-2xl active:bg-red-100"
            onPress={handleDeleteAccount}
          >
            <Trash2 color="#ef4444" size={20} />
            <Text className="text-red-500 font-semibold text-base ml-2">
              Eliminar cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// Componentes Auxiliares
// ==========================================

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isLast?: boolean;
  hideChevron?: boolean;
  onPress?: () => void;
}

function SettingsItem({
  icon,
  label,
  value,
  isLast,
  hideChevron,
  onPress,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className={`flex-row items-center gap-3 px-4 py-4 bg-white ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <View className="w-6 items-center justify-center">{icon}</View>
      <Text className="flex-1 text-base text-gray-900 font-medium">
        {label}
      </Text>
      {value && <Text className="text-sm text-gray-500">{value}</Text>}
      {!hideChevron && <ChevronRight color="#9CA3AF" size={20} />}
    </TouchableOpacity>
  );
}

interface SettingsToggleProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
}

function SettingsToggle({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  isLast,
}: SettingsToggleProps) {
  return (
    <View
      className={`flex-row items-center justify-between gap-3 px-4 py-4 bg-white ${
        !isLast ? "border-b border-gray-100" : ""
      } ${disabled ? "opacity-50" : "opacity-100"}`}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-6 items-center justify-center">{icon}</View>
        <View className="flex-1 pr-4">
          <Text className="text-base text-gray-900 font-medium">{label}</Text>
          {description && (
            <Text className="text-xs text-gray-500 mt-0.5 leading-4">
              {description}
            </Text>
          )}
        </View>
      </View>
      {/* Switch nativo con colores de FoodSync */}
      <Switch
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        trackColor={{ false: "#E5E7EB", true: "#10B981" }}
        thumbColor={checked ? "#FFFFFF" : "#FFFFFF"}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}
