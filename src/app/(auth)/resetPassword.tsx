import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CheckCircle2, CircleAlert } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../../services/authService";

export default function ResetPasswordScreen() {
  // Captura automáticamente el ?token=... que viene del enlace del correo
  const { token } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    // 1. Validaciones de política de contraseñas (Igual que en el registro)
    if (!password || !confirmPassword) {
      setPasswordError("Si us plau, omple tots els camps.");
      return;
    }

    if (password.length < 6 || password.length > 32) {
      setPasswordError("La contrasenya ha de tenir entre 6 i 32 caràcters.");
      return;
    }

    if (/\s/.test(password)) {
      setPasswordError("La contrasenya no pot contenir espais.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Les contrasenyes no coincideixen.");
      return;
    }

    setPasswordError("");
    setIsLoading(true);

    try {
      // Enviamos el token del link y la nueva contraseña al backend
      await authService.resetPassword(token as string, password);
      setIsSuccess(true);
    } catch (error: any) {
      Alert.alert("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={40}
        showsVerticalScrollIndicator={false}
      >
        {/* Flecha de volver atrás flotante estilo Login */}
        <View className="px-4 pt-6 pb-4">
          <TouchableOpacity
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-gray-200"
            onPress={() => router.replace("/(auth)/login")}
            disabled={isLoading}
          >
            <ArrowLeft color="#1F2937" size={24} />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pt-4">
          {!isSuccess ? (
            <>
              {/* Títulos alineados con tu diseño */}
              <Text className="text-3xl font-bold mb-2 text-gray-900">
                Nova contrasenya
              </Text>
              <Text className="text-gray-500 mb-8">
                Introdueix i confirma la teva nova contrasenya de seguretat per
                recuperar l&apos;accés.
              </Text>

              <View className="space-y-5">
                {/* Input 1: Nueva Contraseña */}
                <View className="space-y-2">
                  <Text className="font-medium text-gray-900">
                    Nova contrasenya
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Mínim 6 caràcters"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="h-14 px-4 rounded-2xl bg-gray-100 text-base"
                    editable={!isLoading}
                  />
                </View>

                {/* Input 2: Confirmar Contraseña */}
                <View className="space-y-2">
                  <Text className="font-medium text-gray-900">
                    Confirmar contrasenya
                  </Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeteix la contrasenya"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="h-14 px-4 rounded-2xl bg-gray-100 text-base"
                    editable={!isLoading}
                  />

                  {/* Alerta de error con tu componente circular */}
                  {passwordError ? (
                    <View className="flex-row gap-2 items-center mt-1">
                      <CircleAlert color="#ef4444" size={16} />
                      <Text className="text-red-500 text-sm font-medium">
                        {passwordError}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Botón de Guardar */}
                <TouchableOpacity
                  className={`w-full h-12 rounded-xl flex items-center justify-center mt-6 shadow-sm ${
                    isLoading
                      ? "bg-emerald-400"
                      : "bg-emerald-500 active:bg-emerald-600"
                  }`}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-base font-bold">
                      Restablir contrasenya
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Pantalla de Éxito Final
            <View className="flex-1 items-center justify-center pt-8">
              <View className="items-center px-2 space-y-4 mb-8">
                <View className="w-20 h-20 rounded-full bg-emerald-50 items-center justify-center mb-2">
                  <CheckCircle2 color="#10B981" size={40} />
                </View>
                <Text className="text-3xl font-bold text-gray-900 text-center">
                  Contrasenya canviada
                </Text>
                <Text className="text-gray-500 text-center leading-5 px-4 mt-2">
                  La teva contrasenya s&apos;ha restablert correctament. Ja pots
                  iniciar sessió amb les teves noves credencials.
                </Text>
              </View>

              <TouchableOpacity
                className="w-full h-12 rounded-xl flex items-center justify-center mt-4 shadow-sm bg-gray-900 active:bg-black"
                onPress={() => router.replace("/(auth)/login")}
              >
                <Text className="text-white text-base font-bold">
                  Anar al Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
