import { useFocusEffect } from "@react-navigation/native";
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
import React, { useCallback, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

export default function SettingsScreen() {
  const { setSession } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "Carregant...",
    email: "Carregant...",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", // Avatar por defecto
  });

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const result = await authService.verify();
          setUserData({
            name: result.user.username,
            email: result.user.email,
            avatar: `https://ui-avatars.com/api/?name=${result.user.username}&background=10B981&color=fff&bold=true`,
          });
        } catch (error) {
          console.error("Error al verificar sessió:", error);
          router.replace("/");
        }
      };

      fetchUserData();
    }, []),
  );

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error al cerrar sessió en el servidor:", error);
    } finally {
      setIsLoading(false);
      setSession(null);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar compte",
      "Estàs segur? S'esborraràn totes les teves dades de l'inventari i llars compartits. Aquesta acció no es pot desfer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await authService.deleteAccount();

              router.dismissAll();
              router.replace("/");
            } catch (error) {
              Alert.alert(
                "Error",
                "No s'ha pogut eliminar el compte. Intenta-ho de nou.",
              );
            } finally {
              setIsLoading(false);
              setSession(null);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      {/* Cabecera */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Configuració</Text>
      </View>

      {/* Contenido principal scrolleable */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de Perfil */}
        <TouchableOpacity className="flex-row items-center gap-4 bg-white p-4 rounded-2xl mb-8 shadow-sm border border-gray-100">
          <Image
            source={{ uri: userData.avatar }}
            className="w-16 h-16 rounded-full bg-gray-200"
          />
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-900">
              {userData.name}
            </Text>
            <Text className="text-sm text-gray-500">{userData.email}</Text>
          </View>
          <ChevronRight color="#9CA3AF" size={24} />
        </TouchableOpacity>

        {/* Sección: Cuenta */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3 px-1">Compte</Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <SettingsItem
              icon={<User color="#6B7280" size={20} />}
              label="Informació del perfil"
            />
            <SettingsItem
              icon={<Shield color="#6B7280" size={20} />}
              label="Privacitat i seguretat"
            />
            <SettingsItem
              icon={<Globe color="#6B7280" size={20} />}
              label="Llengua"
              value="Català"
              isLast
            />
          </View>
        </View>

        {/* Sección: Notificaciones */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3 px-1">
            Notificacions
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <SettingsToggle
              icon={<Bell color="#6B7280" size={20} />}
              label="Notificacions Push"
              description="Rep avisos en aquest dispositiu"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <SettingsToggle
              icon={<Bell color="#6B7280" size={20} />}
              label="Alertes de caducitat"
              description="Avisos abans de que els aliments caduquen"
              checked={expirationAlerts}
              onCheckedChange={setExpirationAlerts}
              disabled={!notificationsEnabled}
            />
            <SettingsToggle
              icon={<Bell color="#6B7280" size={20} />}
              label="Alertes de baix stock"
              description="Avisos de productes que s'agoten"
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
              label="Mode fosc"
              description="Canviar al tema fosc"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              isLast
            />
          </View>
        </View>

        {/* Sección: Aplicación */}
        <View className="mb-8">
          <Text className="font-semibold text-gray-900 mb-3 px-1">
            Aplicació
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <SettingsItem
              icon={<Smartphone color="#6B7280" size={20} />}
              label="Versió de l'app"
              value="1.0.0"
              hideChevron
            />
            <SettingsItem
              icon={<HelpCircle color="#6B7280" size={20} />}
              label="Ajuda i suport"
            />
            <SettingsItem
              icon={<FileText color="#6B7280" size={20} />}
              label="Terms i privacitat"
              isLast
            />
          </View>
        </View>

        {/* Botones de Peligro (Cerrar sesión y Eliminar cuenta) */}
        <View className="space-y-4 gap-4">
          <TouchableOpacity
            className={`w-full flex-row items-center justify-center h-14 bg-white border border-red-200 rounded-2xl shadow-sm ${
              isLoading ? "opacity-50" : "active:bg-red-50"
            }`}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <LogOut color="#ef4444" size={20} />
            <Text className="text-red-500 font-semibold text-base ml-2">
              {isLoading ? "Tancant sessió..." : "Tancar sessió"}
            </Text>
          </TouchableOpacity>

          {/* Botón de eliminar cuenta añadido */}
          <TouchableOpacity
            className={`w-full flex-row items-center justify-center h-14 rounded-2xl ${
              isLoading
                ? "bg-red-100 opacity-50"
                : "bg-red-50 active:bg-red-100"
            }`}
            onPress={handleDeleteAccount}
            disabled={isLoading}
          >
            <Trash2 color="#ef4444" size={20} />
            <Text className="text-red-500 font-semibold text-base ml-2">
              {isLoading ? "Eliminant compte..." : "Eliminar compte"}
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
