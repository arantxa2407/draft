import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { homeService } from "../../services/homeService";

import HouseholdDashboard from "../../components/household/HouseholdDashboard";
import NoHousehold from "../../components/household/NoHousehold";

export default function HouseholdScreen() {
  const { session } = useAuth();
  const [currentHousehold, setCurrentHousehold] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, []),
  );

  const fetchHomeData = async () => {
    setIsLoading(true);
    try {
      const data = await homeService.getHome();
      setCurrentHousehold(data);
    } catch (error: any) {
      setCurrentHousehold(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAF8] justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  // Si no hay hogar, mostramos la vista de crear/unirse
  if (!currentHousehold) {
    return <NoHousehold onSuccess={fetchHomeData} />;
  }

  // Si hay hogar, mostramos el dashboard
  return (
    <HouseholdDashboard
      household={currentHousehold}
      session={session}
      onRefresh={fetchHomeData}
    />
  );
}

// import * as Clipboard from "expo-clipboard";
// import { useFocusEffect } from "expo-router";
// import {
//   Copy,
//   Crown,
//   Home,
//   LogOut,
//   UserMinus,
//   Users,
// } from "lucide-react-native";
// import React, { useCallback, useState } from "react";
// import {
//   Alert,
//   Image,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuth } from "../../context/AuthContext";
// import { homeService } from "../../services/homeService";

// export default function HouseholdScreen() {
//   const { session } = useAuth();

//   const [currentHousehold, setCurrentHousehold] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewState, setViewState] = useState<"menu" | "joining" | "creating">(
//     "menu",
//   );

//   const [inviteCode, setInviteCode] = useState("");
//   const [homeName, setHomeName] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Variable clave para saber si el usuario logueado es el Admin
//   const isOwner = currentHousehold?.owner_id === session?.id;

//   useFocusEffect(
//     useCallback(() => {
//       fetchHomeData();
//     }, []),
//   );

//   const fetchHomeData = async () => {
//     setIsLoading(true);
//     try {
//       const data = await homeService.getHome();
//       setCurrentHousehold(data);
//     } catch (error: any) {
//       setCurrentHousehold(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // =========================================================================
//   // FUNCIONES DE CREAR, UNIR Y SALIR
//   // =========================================================================
//   const handleCreateHome = async () => {
//     if (homeName.trim().length < 2) {
//       Alert.alert("Error", "El nombre debe tener al menos 2 caracteres.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const result = await homeService.createHome(homeName.trim());
//       setCurrentHousehold(result.home);
//       setViewState("menu");
//       setHomeName("");
//     } catch (error: any) {
//       Alert.alert("Error al crear", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleJoinHome = async () => {
//     if (inviteCode.trim().length === 0) return;
//     setIsSubmitting(true);
//     try {
//       const result = await homeService.joinHome(
//         inviteCode.trim().toUpperCase(),
//       );
//       setCurrentHousehold(result.home);
//       setViewState("menu");
//       setInviteCode("");
//     } catch (error: any) {
//       Alert.alert("Código incorrecto", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleLeaveHousehold = () => {
//     const isTransferringOwnership =
//       isOwner && currentHousehold.members.length > 1;
//     const message = isTransferringOwnership
//       ? "¿Estás seguro? Al salir, la propiedad del hogar pasará al miembro más antiguo."
//       : "¿Estás seguro de que quieres salir de este hogar? Perderás el acceso al inventario.";

//     Alert.alert("Salir del hogar", message, [
//       { text: "Cancelar", style: "cancel" },
//       {
//         text: "Salir",
//         style: "destructive",
//         onPress: async () => {
//           setIsLoading(true);
//           try {
//             await homeService.leaveHome();
//             setCurrentHousehold(null);
//           } catch (error: any) {
//             Alert.alert("Error", error);
//           } finally {
//             setIsLoading(false);
//           }
//         },
//       },
//     ]);
//   };

//   const copyInviteCode = async () => {
//     if (currentHousehold?.invite_code) {
//       await Clipboard.setStringAsync(currentHousehold.invite_code);
//       Alert.alert(
//         "Código copiado",
//         `El código ${currentHousehold.invite_code} se ha copiado.`,
//       );
//     }
//   };

//   // =========================================================================
//   // NUEVO: EXPULSAR MIEMBRO INDIVIDUAL (Solo Admin)
//   // =========================================================================
//   const handleKickMember = (memberId: string, memberName: string) => {
//     Alert.alert(
//       "Expulsar miembro",
//       `¿Estás seguro de que quieres expulsar a ${memberName}? Perderá acceso a todo el inventario de esta casa.`,
//       [
//         { text: "Cancelar", style: "cancel" },
//         {
//           text: "Expulsar",
//           style: "destructive",
//           onPress: async () => {
//             setIsLoading(true);
//             try {
//               await homeService.kickMember(memberId);
//               await fetchHomeData();
//             } catch (error: any) {
//               Alert.alert("Error", error);
//               setIsLoading(false);
//             }
//           },
//         },
//       ],
//     );
//   };

//   // =========================================================================
//   // VISTA A: NO TIENE HOGAR
//   // =========================================================================
//   if (!currentHousehold) {
//     return (
//       <SafeAreaView className="flex-1 bg-[#F8FAF8] justify-center px-6">
//         <View className="items-center w-full">
//           <View className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
//             <Home color="#10B981" size={48} />
//           </View>

//           <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
//             Gestiona tu hogar
//           </Text>

//           {viewState === "menu" && (
//             <>
//               <Text className="text-gray-500 text-center mb-10 text-base px-4">
//                 Únete a un hogar existente con un código o crea uno nuevo para
//                 compartir tu inventario.
//               </Text>
//               <TouchableOpacity
//                 className="w-full bg-emerald-500 py-4 rounded-2xl active:bg-emerald-600 mb-4 shadow-sm"
//                 onPress={() => setViewState("joining")}
//               >
//                 <Text className="text-white font-bold text-center text-lg">
//                   Unirse con un código
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="w-full bg-white border-2 border-emerald-500 py-4 rounded-2xl active:bg-emerald-50"
//                 onPress={() => setViewState("creating")}
//               >
//                 <Text className="text-emerald-600 font-bold text-center text-lg">
//                   Crear nuevo hogar
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {viewState === "joining" && (
//             <View className="w-full mt-2">
//               <Text className="text-gray-700 font-semibold mb-4 text-center">
//                 Introduce el código de invitación:
//               </Text>
//               <TextInput
//                 className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-xl mb-6 text-center tracking-widest uppercase font-bold text-gray-900 shadow-sm"
//                 placeholder="Ej: A1B2C3D"
//                 placeholderTextColor="#9CA3AF"
//                 value={inviteCode}
//                 onChangeText={setInviteCode}
//                 autoCapitalize="characters"
//                 autoCorrect={false}
//                 maxLength={8}
//                 editable={!isSubmitting}
//               />
//               <TouchableOpacity
//                 className={`w-full py-4 rounded-2xl mb-3 shadow-sm ${inviteCode.length > 0 && !isSubmitting ? "bg-emerald-500 active:bg-emerald-600" : "bg-emerald-300"}`}
//                 onPress={handleJoinHome}
//                 disabled={inviteCode.length === 0 || isSubmitting}
//               >
//                 <Text className="text-white font-bold text-center text-lg">
//                   {isSubmitting ? "Verificando..." : "Confirmar y entrar"}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="w-full py-4 rounded-2xl active:bg-gray-100"
//                 onPress={() => {
//                   setViewState("menu");
//                   setInviteCode("");
//                 }}
//                 disabled={isSubmitting}
//               >
//                 <Text className="text-gray-500 font-bold text-center text-lg">
//                   Volver atrás
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {viewState === "creating" && (
//             <View className="w-full mt-2">
//               <Text className="text-gray-700 font-semibold mb-4 text-center">
//                 ¿Cómo se llamará tu hogar?
//               </Text>
//               <TextInput
//                 className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-lg mb-6 text-center font-bold text-gray-900 shadow-sm"
//                 placeholder="Ej: Familia López"
//                 placeholderTextColor="#9CA3AF"
//                 value={homeName}
//                 onChangeText={setHomeName}
//                 autoCapitalize="words"
//                 editable={!isSubmitting}
//               />
//               <TouchableOpacity
//                 className={`w-full py-4 rounded-2xl mb-3 shadow-sm ${homeName.length >= 2 && !isSubmitting ? "bg-emerald-500 active:bg-emerald-600" : "bg-emerald-300"}`}
//                 onPress={handleCreateHome}
//                 disabled={homeName.length < 2 || isSubmitting}
//               >
//                 <Text className="text-white font-bold text-center text-lg">
//                   {isSubmitting ? "Creando..." : "Crear hogar"}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="w-full py-4 rounded-2xl active:bg-gray-100"
//                 onPress={() => {
//                   setViewState("menu");
//                   setHomeName("");
//                 }}
//                 disabled={isSubmitting}
//               >
//                 <Text className="text-gray-500 font-bold text-center text-lg">
//                   Volver atrás
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // =========================================================================
//   // VISTA B: DASHBOARD DEL HOGAR (Ya estás dentro)
//   // =========================================================================
//   return (
//     <SafeAreaView className="flex-1 bg-[#F8FAF8]">
//       <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-row items-center justify-between">
//         <Text className="text-2xl font-bold text-gray-900">Mi Hogar</Text>
//       </View>

//       <ScrollView
//         className="flex-1"
//         contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Tarjeta del Hogar Actual */}
//         <View className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl mb-6 shadow-sm">
//           <View className="flex-row items-center gap-4 mb-5">
//             <View className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
//               <Users color="white" size={28} />
//             </View>
//             <View>
//               <Text className="font-bold text-xl text-gray-900">
//                 {currentHousehold.name}
//               </Text>
//               <Text className="text-emerald-600 font-medium">
//                 {currentHousehold.members?.length ||
//                   currentHousehold.member_count}{" "}
//                 miembros
//               </Text>
//             </View>
//           </View>

//           {isOwner ? (
//             <View className="bg-white/90 rounded-2xl p-4 flex-row items-center justify-between border border-emerald-50">
//               <View>
//                 <Text className="text-xs text-gray-500 mb-1 font-medium">
//                   Código actual
//                 </Text>
//                 <Text className="font-bold text-xl tracking-widest text-gray-900">
//                   {currentHousehold.invite_code}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 className="flex-row items-center bg-gray-100 px-3 py-2 rounded-xl active:bg-gray-200"
//                 onPress={copyInviteCode}
//               >
//                 <Copy color="#4B5563" size={16} className="mr-2" />
//                 <Text className="font-semibold text-gray-700">Copiar</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View className="bg-white/90 rounded-2xl p-3 border border-emerald-50">
//               <Text className="text-xs text-gray-500 text-center">
//                 Pide al administrador el código para invitar a más gente.
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Lista de Miembros */}
//         <View className="mb-8">
//           <Text className="text-lg font-bold text-gray-900 mb-4 px-1">
//             Miembros del equipo
//           </Text>
//           <View className="space-y-3 gap-3">
//             {currentHousehold.members?.map((member: any) => (
//               <View
//                 key={member.user_id}
//                 className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
//               >
//                 <View className="flex-row items-center gap-3">
//                   <Image
//                     source={{
//                       uri: `https://ui-avatars.com/api/?name=${member.username}&background=10B981&color=fff&bold=true`,
//                     }}
//                     className="w-12 h-12 rounded-full"
//                   />
//                   <View>
//                     <View className="flex-row items-center gap-1.5">
//                       <Text className="font-bold text-base text-gray-900">
//                         {member.username}
//                       </Text>
//                       {member.role === "owner" && (
//                         <Crown color="#F59E0B" size={16} />
//                       )}
//                     </View>
//                     <Text className="text-xs text-gray-400 mt-0.5">
//                       Se unió el{" "}
//                       {new Date(member.joined_at).toLocaleDateString()}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Controles de la derecha (Badge y Botón de expulsar) */}
//                 <View className="flex-row items-center gap-2">
//                   <View
//                     className={`px-2.5 py-1 rounded-lg ${member.role === "owner" ? "bg-emerald-100" : "bg-gray-100"}`}
//                   >
//                     <Text
//                       className={`text-xs font-bold uppercase ${member.role === "owner" ? "text-emerald-700" : "text-gray-600"}`}
//                     >
//                       {member.role === "owner" ? "Admin" : "Miembro"}
//                     </Text>
//                   </View>

//                   {/* NUEVO: Botón de papelera para expulsar. Solo aparece si eres owner y NO eres tú mismo */}
//                   {isOwner && member.user_id !== session?.id && (
//                     <TouchableOpacity
//                       className="bg-red-50 p-2 rounded-lg border border-red-100 active:bg-red-100 ml-1"
//                       onPress={() =>
//                         handleKickMember(member.user_id, member.username)
//                       }
//                     >
//                       <UserMinus color="#EF4444" size={16} />
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View className="space-y-3 gap-3">
//           <TouchableOpacity
//             className="flex-row items-center justify-center p-4 bg-white rounded-2xl border border-gray-200 active:bg-gray-100"
//             onPress={handleLeaveHousehold}
//           >
//             <LogOut color="#4B5563" size={20} className="mr-2" />
//             <Text className="font-bold text-gray-700 text-base">
//               Salir de este hogar
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
