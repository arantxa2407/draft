import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, CircleAlert, Check } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStarted, setPasswordStarted] = useState(false);

  const handleRegister = () => {
    // Aquí iría tu lógica de conexión a la API (Axios)
    // Una vez registrado, usamos "replace" en lugar de "push" para
    // que el usuario no pueda volver a la pantalla de registro dándole "Atrás"
    const emailValid = isValidEmail(email);
    const passwordValid = isValidPassword(password);

    if (!emailValid) setEmailError("Correo no válido");
    if (!passwordValid)
      setPasswordError("La contraseña no cumple los requisitos");

    if (emailValid && passwordValid) {
      router.push("/(tabs)/dashboard");
    } else {
      alert("Por favor, corrige los errores antes de registrarte.");
    }
  };

  //function that controls if the user is writins the correct format of email nom@domini.com

  //com encara no hi ha bd no podem fer control de si ja existeix un compte amb aquest email, pero mostrara un error si el format del email no es correcte
  //si el correu no es correcte, mostrarà un error i no permetrà registrar-se fins que el format sigui correcte
  //eliminar els espais en blanc al principi i al final del email
  //el correu es compara sense tenir en compte les majúscules o minúscules, ja que els correus no són sensibles a això
  //el correu tindra com a maxim 128 caracters
  const isValidEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length > 128) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  };

  const handleEmailBlur = () => {
    if (!isValidEmail(email)) {
      setEmailError("Correo no válido");
    } else {
      setEmailError("");
    }
  };

  //el mensaje de error deberia de mostrar una checklist de los requisitos que no se cumplen, por ejemplo: "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial" e ir tachando los requisitos que se cumplen a medida que el usuario va escribiendo la contraseña, pero por simplicidad solo mostraremos un mensaje de error general si la contraseña no cumple con los requisitos
  const handlePasswordBlur = () => {
    if (!isValidPassword(password)) {
      setPasswordError(
        "La contraseña debe tener entre 6 y 32 caracteres, al menos una mayúscula, una minúscula, un número y un caracter especial",
      );
    } else {
      setPasswordError("");
    }
  };

  //function that controls if the password is at least 6 characters and not longest than 32 characters long and has at least one number, one special character, one uppercase letter and one lowercase letter
  // Validaciones individuales
  const hasLength = (pass: string) => pass.length >= 6 && pass.length <= 32;
  const hasUpper = (pass: string) => /[A-Z]/.test(pass);
  const hasLower = (pass: string) => /[a-z]/.test(pass);
  const hasNumber = (pass: string) => /\d/.test(pass);
  const hasSpecial = (pass: string) => /[!@#$%^&*()-+]/.test(pass);

  // Validación general (para handleRegister)
  const isValidPassword = (pass: string) => {
    return (
      hasLength(pass) &&
      hasUpper(pass) &&
      hasLower(pass) &&
      hasNumber(pass) &&
      hasSpecial(pass)
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Cabecera con Botón de Atrás */}
          <View className="px-4 pt-6 pb-4">
            <TouchableOpacity
              className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-gray-200"
              onPress={() => router.back()}
            >
              <ArrowLeft color="#1F2937" size={24} />
            </TouchableOpacity>
          </View>

          {/* Contenido Principal */}
          <View className="flex-1 px-6 pt-4">
            <Text className="text-3xl font-bold mb-2 text-gray-900">
              Create account
            </Text>
            <Text className="text-gray-500 mb-8">
              Start reducing food waste today
            </Text>

            <View className="space-y-5">
              {/* Input: Full Name */}
              <View className="space-y-2">
                <Text className="font-medium text-gray-900">Full Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  className="h-14 px-4 rounded-2xl bg-gray-100 text-base "
                />
              </View>

              {/* Input: Email */}
              <View className="space-y-2 mt-4">
                <Text className="font-medium text-gray-900">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={handleEmailBlur}
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="h-14 px-4 rounded-2xl bg-gray-100 text-base"
                />
                {emailError ? (
                  <View className="flex-row gap-2 items-center">
                    <CircleAlert className="text-red-500" size={16} />
                    <Text className="text-red-500">{emailError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Input: Password */}
              <View className="space-y-2 mt-4">
                <Text className="font-medium text-gray-900">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (!passwordStarted) setPasswordStarted(true);
                  }}
                  onBlur={handlePasswordBlur}
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="h-14 px-4 rounded-2xl bg-gray-100 text-base"
                />
                {/* Checklist de requisitos */}
                {passwordStarted && (
                  <View className="mt-2 space-y-1">
                    <View className="flex-row items-center gap-2">
                      {hasLength(password) ? (
                        <Check className="text-green-500" size={16} />
                      ) : (
                        <CircleAlert className="text-red-500" size={16} />
                      )}
                      <Text
                        style={{ color: hasLength(password) ? "green" : "red" }}
                        className="text-sm"
                      >
                        Debe de tener al menos 6 caracteres y no más de 32
                        caracteres
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      {hasUpper(password) ? (
                        <Check className="text-green-500" size={16} />
                      ) : (
                        <CircleAlert className="text-red-500" size={16} />
                      )}
                      <Text
                        style={{ color: hasUpper(password) ? "green" : "red" }}
                        className="text-sm"
                      >
                        Al menos una letra mayúscula
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      {hasLower(password) ? (
                        <Check className="text-green-500" size={16} />
                      ) : (
                        <CircleAlert className="text-red-500" size={16} />
                      )}
                      <Text
                        style={{ color: hasLower(password) ? "green" : "red" }}
                        className="text-sm"
                      >
                        Al menos una letra minúscula
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      {hasNumber(password) ? (
                        <Check className="text-green-500" size={16} />
                      ) : (
                        <CircleAlert className="text-red-500" size={16} />
                      )}
                      <Text
                        style={{ color: hasNumber(password) ? "green" : "red" }}
                        className="text-sm"
                      >
                        Al menos un número
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      {hasSpecial(password) ? (
                        <Check className="text-green-500" size={16} />
                      ) : (
                        <CircleAlert className="text-red-500" size={16} />
                      )}
                      <Text
                        style={{
                          color: hasSpecial(password) ? "green" : "red",
                        }}
                        className="text-sm"
                      >
                        Al menos un caracter especial (!@#$%^&*()-+)
                      </Text>
                    </View>
                  </View>
                )}

                {/* Mensaje de error general (opcional, solo al blur) */}
                {passwordError ? (
                  <View className="flex-row gap-2 items-center mt-1">
                    <CircleAlert className="text-red-500" size={16} />
                    <Text className="text-red-500">{passwordError}</Text>
                  </View>
                ) : null}
              </View>

              <Text className="text-xs text-gray-500 pt-2 mt-2">
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </Text>

              {/* Botón de Registro */}
              <TouchableOpacity
                className="w-full h-12 bg-emerald-500 rounded-xl flex items-center justify-center mt-6 active:bg-emerald-600"
                onPress={handleRegister}
              >
                <Text className="text-white text-base font-semibold">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Enlace al Login */}
            <View className="mt-6 flex-row justify-center items-center pb-8">
              <Text className="text-gray-500">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-emerald-500 font-medium">Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
