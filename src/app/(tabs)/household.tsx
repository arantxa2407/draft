import {
  Copy,
  Crown,
  Home,
  LogOut,
  Plus,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HouseholdScreen() {
  // Mock data (Mantenemos tus datos de prueba)
  const mockHouseholdData = {
    id: "1",
    name: "Familia LIS",
    code: "LIS2026",
    createdBy: "Usuario",
    members: [
      {
        id: "1",
        name: "Usuario",
        email: "usuario@gmail.com",
        role: "owner",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      },
      {
        id: "2",
        name: "Juan Carlos Moure",
        email: "juanca@example.com",
        role: "member",
        avatar:
          "https://0.academia-photos.com/31147116/9147067/10200678/s200_juan_carlos.moure.jpg",
      },
      {
        id: "3",
        name: "Xavier Otazu",
        email: "xavier@example.com",
        role: "member",
        avatar:
          "https://i0.wp.com/julieharrislab.wp.st-andrews.ac.uk/files/2013/02/xavier.otazu_.jpg?ssl=1",
      },
    ],
    stats: {
      sharedItems: 18,
      totalSpent: 342.5,
      savedWaste: 12,
    },
  };

  // Estado para controlar si el usuario está en un hogar
  // Inicialmente lo ponemos con los datos de prueba, puedes cambiarlo a null para probar el otro estado
  const [currentHousehold, setCurrentHousehold] = useState<
    typeof mockHouseholdData | null
  >(mockHouseholdData);

  // NUEVOS ESTADOS para el código
  const [isJoining, setIsJoining] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  // NUEVA FUNCIÓN para validar el código
  const handleVerifyCode = () => {
    // Convertimos a mayúsculas y quitamos espacios por si el usuario se equivoca al teclear
    const cleanCode = inviteCode.trim().toUpperCase();

    if (cleanCode === mockHouseholdData.code) {
      // ¡Éxito! Asignamos el hogar y reseteamos el formulario
      setCurrentHousehold(mockHouseholdData);
      setIsJoining(false);
      setInviteCode("");
    } else {
      // Error
      if (Platform.OS === "web") {
        window.alert("Código incorrecto. (Pista: el código es LIS2026)");
      } else {
        Alert.alert(
          "Código incorrecto",
          "El código introducido no es válido. Comprueba que esté bien escrito.",
        );
      }
    }
  };
  const copyInviteCode = () => {
    Alert.alert(
      "Código copiado",
      `El código ${currentHousehold?.code} se ha copiado al portapapeles.`,
    );
  };

  // Función para salir del hogar
  const handleLeaveHousehold = () => {
    console.log("Botón de salir presionado"); // Para depurar en consola

    if (Platform.OS === "web") {
      // Solución para la versión Web
      const isConfirmed = window.confirm(
        "¿Estás seguro de que quieres salir de este hogar? Perderás el acceso a las listas compartidas.",
      );
      if (isConfirmed) {
        setCurrentHousehold(null);
      }
    } else {
      // Solución nativa para iOS y Android
      Alert.alert(
        "Salir del hogar",
        "¿Estás seguro de que quieres salir de este hogar? Perderás el acceso a las listas compartidas.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir",
            style: "destructive",
            onPress: () => setCurrentHousehold(null),
          },
        ],
      );
    }
  };

  // Función simulada para unirse (solo para que puedas probar el flujo)
  const handleJoinMock = () => {
    setCurrentHousehold(mockHouseholdData);
  };

  // =========================================================================
  // VISTA: CUANDO NO ESTÁS EN NINGÚN HOGAR
  // =========================================================================
  if (!currentHousehold) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAF8] justify-center px-6">
        <View className="items-center w-full">
          <View className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Home color="#10B981" size={48} />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Aún no tienes un hogar
          </Text>

          {!isJoining ? (
            // --- ESTADO 1: BOTONES INICIALES ---
            <>
              <Text className="text-gray-500 text-center mb-10 text-base px-4">
                Únete a un hogar existente con un código de invitación o crea
                uno nuevo para empezar a organizarte.
              </Text>

              <TouchableOpacity
                className="w-full bg-emerald-500 py-4 rounded-2xl active:bg-emerald-600 mb-4 shadow-sm"
                onPress={() => setIsJoining(true)} // <-- Cambiamos esto
              >
                <Text className="text-white font-bold text-center text-lg">
                  Unirse con un código
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-full bg-white border-2 border-emerald-500 py-4 rounded-2xl active:bg-emerald-50">
                <Text className="text-emerald-600 font-bold text-center text-lg">
                  Crear nuevo hogar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // --- ESTADO 2: FORMULARIO DE CÓDIGO ---
            <View className="w-full mt-2">
              <Text className="text-gray-700 font-semibold mb-2 ml-1 text-center">
                Introduce el código de 7 caracteres:
              </Text>

              <TextInput
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-xl mb-6 text-center tracking-widest uppercase font-bold text-gray-900 shadow-sm"
                placeholder="Ej: SMTH2024"
                placeholderTextColor="#9CA3AF"
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={7}
              />

              <TouchableOpacity
                className={`w-full py-4 rounded-2xl mb-3 shadow-sm ${
                  inviteCode.length > 0
                    ? "bg-emerald-500 active:bg-emerald-600"
                    : "bg-emerald-300"
                }`}
                onPress={handleVerifyCode}
                disabled={inviteCode.length === 0}
              >
                <Text className="text-white font-bold text-center text-lg">
                  Confirmar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full py-4 rounded-2xl active:bg-gray-100"
                onPress={() => {
                  setIsJoining(false);
                  setInviteCode(""); // Limpiamos si cancela
                }}
              >
                <Text className="text-gray-500 font-bold text-center text-lg">
                  Volver atrás
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
  // =========================================================================
  // VISTA: CUANDO SÍ ESTÁS EN UN HOGAR (Tu código original + Botón de salir)
  // =========================================================================
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      {/* Cabecera */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">Hogar</Text>
        <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center active:bg-gray-200">
          <Settings color="#4B5563" size={20} />
        </TouchableOpacity>
      </View>

      {/* Contenido Principal */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta del Hogar */}
        <View className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl mb-6 shadow-sm">
          <View className="flex-row items-start justify-between mb-5">
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
                <Users color="white" size={28} />
              </View>
              <View>
                <Text className="font-bold text-xl text-gray-900">
                  {currentHousehold.name}
                </Text>
                <Text className="text-emerald-600 font-medium mt-0.5">
                  {currentHousehold.members.length} miembros
                </Text>
              </View>
            </View>
          </View>

          {/* Caja del Código de Invitación */}
          <View className="bg-white/90 rounded-2xl p-4 mb-3 flex-row items-center justify-between border border-emerald-50">
            <View>
              <Text className="text-xs text-gray-500 mb-1 font-medium">
                Código de invitación
              </Text>
              <Text className="font-bold text-xl tracking-widest text-gray-900">
                {currentHousehold.code}
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center bg-gray-100 px-3 py-2 rounded-xl active:bg-gray-200"
              onPress={copyInviteCode}
            >
              <Copy color="#4B5563" size={16} className="mr-2" />
              <Text className="font-semibold text-gray-700">Copiar</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-gray-500 text-center mt-1">
            Comparte este código para invitar a familiares a tu hogar
          </Text>
        </View>

        {/* Estadísticas */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
            <Text className="text-2xl font-bold text-emerald-500 mb-1">
              {currentHousehold.stats.sharedItems}
            </Text>
            <Text className="text-xs font-medium text-gray-500 text-center">
              Artículos
            </Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
            <Text className="text-2xl font-bold text-emerald-500 mb-1">
              ${currentHousehold.stats.totalSpent}
            </Text>
            <Text className="text-xs font-medium text-gray-500 text-center">
              Este Mes
            </Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
            <Text className="text-2xl font-bold text-emerald-500 mb-1">
              {currentHousehold.stats.savedWaste}kg
            </Text>
            <Text className="text-xs font-medium text-gray-500 text-center">
              Ahorro
            </Text>
          </View>
        </View>

        {/* Miembros */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-lg font-bold text-gray-900">Miembros</Text>
            <TouchableOpacity className="flex-row items-center bg-emerald-50 px-3 py-2 rounded-xl active:bg-emerald-100">
              <Plus color="#10B981" size={16} className="mr-1" />
              <Text className="font-semibold text-emerald-600">Invitar</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {currentHousehold.members.map((member) => (
              <View
                key={member.id}
                className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{ uri: member.avatar }}
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                  <View>
                    <View className="flex-row items-center gap-1.5">
                      <Text className="font-bold text-base text-gray-900">
                        {member.name}
                      </Text>
                      {member.role === "owner" && (
                        <Crown color="#F59E0B" size={16} />
                      )}
                    </View>
                    <Text className="text-sm text-gray-500 mt-0.5">
                      {member.email}
                    </Text>
                  </View>
                </View>

                <View
                  className={`px-2.5 py-1 rounded-lg ${
                    member.role === "owner" ? "bg-emerald-100" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase ${
                      member.role === "owner"
                        ? "text-emerald-700"
                        : "text-gray-600"
                    }`}
                  >
                    {member.role === "owner" ? "Admin" : "Miembro"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View>
          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">
            Acciones Rápidas
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 mb-3">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp color="#10B981" size={24} />
              </View>
              <View>
                <Text className="font-bold text-base text-gray-900">
                  Ver Gastos
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  Controla los gastos compartidos
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* NUEVO BOTÓN: Salir del Hogar */}
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 shadow-sm active:bg-red-100"
            onPress={handleLeaveHousehold}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <LogOut color="#EF4444" size={24} />
              </View>
              <View>
                <Text className="font-bold text-base text-red-600">
                  Salir del Hogar
                </Text>
                <Text className="text-sm text-red-500 mt-0.5">
                  Dejarás de pertenecer a este grupo
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// import {
//   Copy,
//   Crown,
//   Plus,
//   Settings,
//   TrendingUp,
//   Users,
// } from "lucide-react-native";
// import React from "react";
// import {
//   Alert,
//   Image,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function HouseholdScreen() {
//   // Mock data (Mantenemos tus datos de prueba)
//   const household = {
//     id: "1",
//     name: "Familia Smith",
//     code: "SMTH2024",
//     createdBy: "Tú",
//     members: [
//       {
//         id: "1",
//         name: "Tú",
//         email: "john@example.com",
//         role: "owner",
//         avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
//       },
//       {
//         id: "2",
//         name: "Sarah Smith",
//         email: "sarah@example.com",
//         role: "member",
//         avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
//       },
//       {
//         id: "3",
//         name: "Mike Smith",
//         email: "mike@example.com",
//         role: "member",
//         avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//       },
//     ],
//     stats: {
//       sharedItems: 18,
//       totalSpent: 342.5,
//       savedWaste: 12,
//     },
//   };

//   const copyInviteCode = () => {
//     // En una app real usarías expo-clipboard
//     // import * as Clipboard from 'expo-clipboard';
//     // Clipboard.setStringAsync(household.code);
//     Alert.alert(
//       "Código copiado",
//       `El código ${household.code} se ha copiado al portapapeles.`,
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-[#F8FAF8]">
//       {/* Cabecera */}
//       <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-row items-center justify-between">
//         <Text className="text-2xl font-bold text-gray-900">Hogar</Text>
//         <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center active:bg-gray-200">
//           <Settings color="#4B5563" size={20} />
//         </TouchableOpacity>
//       </View>

//       {/* Contenido Principal */}
//       <ScrollView
//         className="flex-1"
//         contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Tarjeta del Hogar */}
//         <View className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl mb-6 shadow-sm">
//           <View className="flex-row items-start justify-between mb-5">
//             <View className="flex-row items-center gap-4">
//               <View className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
//                 <Users color="white" size={28} />
//               </View>
//               <View>
//                 <Text className="font-bold text-xl text-gray-900">
//                   {household.name}
//                 </Text>
//                 <Text className="text-emerald-600 font-medium mt-0.5">
//                   {household.members.length} miembros
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Caja del Código de Invitación */}
//           <View className="bg-white/90 rounded-2xl p-4 mb-3 flex-row items-center justify-between border border-emerald-50">
//             <View>
//               <Text className="text-xs text-gray-500 mb-1 font-medium">
//                 Código de invitación
//               </Text>
//               <Text className="font-bold text-xl tracking-widest text-gray-900">
//                 {household.code}
//               </Text>
//             </View>
//             <TouchableOpacity
//               className="flex-row items-center bg-gray-100 px-3 py-2 rounded-xl active:bg-gray-200"
//               onPress={copyInviteCode}
//             >
//               <Copy color="#4B5563" size={16} className="mr-2" />
//               <Text className="font-semibold text-gray-700">Copiar</Text>
//             </TouchableOpacity>
//           </View>

//           <Text className="text-xs text-gray-500 text-center mt-1">
//             Comparte este código para invitar a familiares a tu hogar
//           </Text>
//         </View>

//         {/* Estadísticas */}
//         <View className="flex-row gap-3 mb-8">
//           <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
//             <Text className="text-2xl font-bold text-emerald-500 mb-1">
//               {household.stats.sharedItems}
//             </Text>
//             <Text className="text-xs font-medium text-gray-500 text-center">
//               Artículos
//             </Text>
//           </View>
//           <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
//             <Text className="text-2xl font-bold text-emerald-500 mb-1">
//               ${household.stats.totalSpent}
//             </Text>
//             <Text className="text-xs font-medium text-gray-500 text-center">
//               Este Mes
//             </Text>
//           </View>
//           <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center">
//             <Text className="text-2xl font-bold text-emerald-500 mb-1">
//               {household.stats.savedWaste}kg
//             </Text>
//             <Text className="text-xs font-medium text-gray-500 text-center">
//               Ahorro
//             </Text>
//           </View>
//         </View>

//         {/* Miembros */}
//         <View className="mb-8">
//           <View className="flex-row items-center justify-between mb-4 px-1">
//             <Text className="text-lg font-bold text-gray-900">Miembros</Text>
//             <TouchableOpacity className="flex-row items-center bg-emerald-50 px-3 py-2 rounded-xl active:bg-emerald-100">
//               <Plus color="#10B981" size={16} className="mr-1" />
//               <Text className="font-semibold text-emerald-600">Invitar</Text>
//             </TouchableOpacity>
//           </View>

//           <View className="space-y-3">
//             {household.members.map((member) => (
//               <View
//                 key={member.id}
//                 className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
//               >
//                 <View className="flex-row items-center gap-3">
//                   {/* Avatar Image */}
//                   <Image
//                     source={{ uri: member.avatar }}
//                     className="w-12 h-12 rounded-full bg-gray-200"
//                   />
//                   <View>
//                     <View className="flex-row items-center gap-1.5">
//                       <Text className="font-bold text-base text-gray-900">
//                         {member.name}
//                       </Text>
//                       {member.role === "owner" && (
//                         <Crown color="#F59E0B" size={16} />
//                       )}
//                     </View>
//                     <Text className="text-sm text-gray-500 mt-0.5">
//                       {member.email}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Badge de Rol */}
//                 <View
//                   className={`px-2.5 py-1 rounded-lg ${
//                     member.role === "owner" ? "bg-emerald-100" : "bg-gray-100"
//                   }`}
//                 >
//                   <Text
//                     className={`text-xs font-bold uppercase ${
//                       member.role === "owner"
//                         ? "text-emerald-700"
//                         : "text-gray-600"
//                     }`}
//                   >
//                     {member.role === "owner" ? "Admin" : "Miembro"}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Acciones Rápidas */}
//         <View>
//           <Text className="text-lg font-bold text-gray-900 mb-4 px-1">
//             Acciones Rápidas
//           </Text>
//           <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50">
//             <View className="flex-row items-center gap-4">
//               <View className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
//                 <TrendingUp color="#10B981" size={24} />
//               </View>
//               <View>
//                 <Text className="font-bold text-base text-gray-900">
//                   Ver Gastos
//                 </Text>
//                 <Text className="text-sm text-gray-500 mt-0.5">
//                   Controla los gastos compartidos
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
