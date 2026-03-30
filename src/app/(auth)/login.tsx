import { router } from "expo-router";
import { ArrowLeft, CircleAlert, Eye, EyeOff } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EMAIL_MAX_LENGTH = 128;
const MIN_PASSWORD_LENGTH = 6;

const isValidEmail = (value: string): boolean => {
  const trimmedEmail = value.trim();

  if (trimmedEmail.length === 0 || trimmedEmail.length > EMAIL_MAX_LENGTH) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmedEmail);
};

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleGoBack = useCallback((): void => {
    router.back();
  }, []);

  const handleGoToRegister = useCallback((): void => {
    router.push("/(auth)/register");
  }, []);

  const handleTogglePasswordVisibility = useCallback((): void => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback((): void => {
    setEmailError("");
    setPasswordError("");

    const trimmedEmail = email.trim();
    const emailValid = isValidEmail(trimmedEmail);
    const passwordValid = password.length >= MIN_PASSWORD_LENGTH;

    if (!emailValid) {
      setEmailError("Introduce un correo electrónico válido");
    }

    if (!passwordValid) {
      setPasswordError("La contraseña es demasiado corta");
    }

    if (emailValid && passwordValid) {
      router.replace("/(tabs)/dashboard");
    }
  }, [email, password]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pt-6 pb-4">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-10 w-10 items-center justify-center rounded-xl active:bg-gray-200"
              onPress={handleGoBack}
            >
              <ArrowLeft color="#1F2937" size={24} />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6 pt-4">
            <Text className="mb-2 text-3xl font-bold text-gray-900">
              Bienvenido de nuevo
            </Text>

            <Text className="mb-8 text-gray-500">
              Inicia sesión en tu cuenta de FoodSync
            </Text>

            <View className="space-y-5">
              <View className="mb-4 space-y-2">
                <Text className="font-medium text-gray-900"> Correo electrónico </Text>

                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="correo@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  className="h-14 rounded-2xl bg-gray-100 px-4 text-base"
                />

                {emailError.length > 0 ? (
                  <View className="mt-1 flex-row items-center gap-2">
                    <CircleAlert color="#EF4444" size={16} />
                    <Text className="text-sm text-red-500">{emailError}</Text>
                  </View>
                ) : null}
              </View>

              <View className="space-y-2">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900">Contraseña</Text>

                  <TouchableOpacity accessibilityRole="button">
                    <Text className="text-sm font-medium text-emerald-500">
                      ¿Has olvidado la contraseña?
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="relative mt-2 justify-center">
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setPassword}
                    placeholder="Introduce la contraseña"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    className="h-14 rounded-2xl bg-gray-100 px-4 pr-12 text-base"
                  />

                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4"
                    onPress={handleTogglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff color="#9CA3AF" size={20} />
                    ) : (
                      <Eye color="#9CA3AF" size={20} />
                    )}
                  </TouchableOpacity>
                </View>

                {passwordError.length > 0 ? (
                  <View className="mt-1 flex-row items-center gap-2">
                    <CircleAlert color="#EF4444" size={16} />
                    <Text className="text-sm text-red-500">
                      {passwordError}
                    </Text>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                className="mt-8 h-14 w-full items-center justify-center rounded-xl bg-emerald-500 shadow-sm active:bg-emerald-600"
                onPress={handleLogin}
              >
                <Text className="text-lg font-semibold text-white">
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-auto flex-row items-center justify-center pb-8">
              <Text className="text-gray-500">¿No tienes cuenta? </Text>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleGoToRegister}
              >
                <Text className="font-bold text-emerald-500">Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}