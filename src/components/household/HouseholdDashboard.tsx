import * as Clipboard from "expo-clipboard";
import { Copy, LogOut, Users } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { homeService } from "../../services/homeService";
import MemberItem from "./MemberItem";

interface HouseholdDashboardProps {
  household: any;
  session: any;
  onRefresh: () => void;
}

export default function HouseholdDashboard({
  household,
  session,
  onRefresh,
}: HouseholdDashboardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isOwner = household?.owner_id === session?.id;

  const copyInviteCode = async () => {
    if (household?.invite_code) {
      await Clipboard.setStringAsync(household.invite_code);
      Alert.alert(
        "Codi copiat",
        `El codi ${household.invite_code} se ha copiat.`,
      );
    }
  };

  const handleLeaveHousehold = () => {
    const isTransferringOwnership = isOwner && household.members.length > 1;
    const message = isTransferringOwnership
      ? "Estàs segur? Al sortir, la propietat de la llar passara al membre més antic."
      : "Estàs segur de que vols sortir de la llar? Perdràs l'accés a l'inventari.";

    Alert.alert("Sortir de la llar", message, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sortir",
        style: "destructive",
        onPress: async () => {
          setIsProcessing(true);
          try {
            await homeService.leaveHome();
            onRefresh();
          } catch (error: any) {
            Alert.alert("Error", error);
          } finally {
            setIsProcessing(false);
          }
        },
      },
    ]);
  };

  const handleKickMember = (memberId: string, memberName: string) => {
    Alert.alert(
      "Expulsar membre",
      `Estàs segur de que vols expulsar a ${memberName}? Perdrà l'accés a tot l'inventari.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Expulsar",
          style: "destructive",
          onPress: async () => {
            setIsProcessing(true);
            try {
              await homeService.kickMember(memberId);
              onRefresh();
            } catch (error: any) {
              Alert.alert("Error", error);
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">La meva llar</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta del Hogar */}
        <View className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl mb-6 shadow-sm">
          <View className="flex-row items-center gap-4 mb-5">
            <View className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
              <Users color="white" size={28} />
            </View>
            <View>
              <Text className="font-bold text-xl text-gray-900">
                {household.name}
              </Text>
              <Text className="text-emerald-600 font-medium">
                {household.members?.length || household.member_count} membres
              </Text>
            </View>
          </View>

          {isOwner ? (
            <View className="bg-white/90 rounded-2xl p-4 flex-row items-center justify-between border border-emerald-50">
              <View>
                <Text className="text-xs text-gray-500 mb-1 font-medium">
                  Codi actual
                </Text>
                <Text className="font-bold text-xl tracking-widest text-gray-900">
                  {household.invite_code}
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
          ) : (
            <View className="bg-white/90 rounded-2xl p-3 border border-emerald-50">
              <Text className="text-xs text-gray-500 text-center">
                Demana el codi a l&apos;administrador per convidar a més gent.
              </Text>
            </View>
          )}
        </View>

        {/* Lista de Miembros */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">
            Membres de la llar
          </Text>
          <View className="space-y-3 gap-3">
            {household.members?.map((member: any) => (
              <MemberItem
                key={member.user_id}
                member={member}
                isOwner={isOwner}
                isCurrentUser={member.user_id === session?.id}
                onKick={() => handleKickMember(member.user_id, member.username)}
              />
            ))}
          </View>
        </View>

        {/* Botón Salir */}
        <View className="space-y-3 gap-3">
          <TouchableOpacity
            className={`flex-row items-center justify-center p-4 bg-red-100 rounded-2xl border border-red-200 active:bg-red-100 ${isProcessing ? "opacity-50" : ""}`}
            onPress={handleLeaveHousehold}
            disabled={isProcessing}
          >
            <LogOut color="#EF4444" size={20} />

            <Text className="ml-2 font-bold text-red-600 text-base">
              {isProcessing ? "Processant..." : "Sortir de la llar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
