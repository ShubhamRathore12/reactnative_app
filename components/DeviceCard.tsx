import { useThemeStore } from "@/store/themeStore";
import { Device } from "@/types";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeviceCardProps {
  device: Device | any;
  onPress: (device: Device) => void;
}

export default function DeviceCard({ device, onPress }: DeviceCardProps) {
  const { getColors } = useThemeStore();
  const colors = getColors();

  // ✅ Safely check each status — default is false (RED)
  const isMachineRunning = device.machineStatus === "Running" ? true : false;
  const isInternetConnected =
    device.internetStatus === "Connected" ? true : false;
  const isCoolingActive = device.coolingStatus === "Active" ? true : false;

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Image source={device.imageUrl} style={styles.image} />
      <Text style={styles.title}>{device.name}</Text>

      {/* Status Section */}
      <View style={styles.statusContainer}>
        <StatusItem label="Machine" active={isMachineRunning} colors={colors} />
        <StatusItem
          label="Internet"
          active={isInternetConnected}
          colors={colors}
        />
        <StatusItem label="Cooling" active={isCoolingActive} colors={colors} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Link
          href={{
            pathname: "/(root)/device/[id]",
            params: { id: device.id.toString() },
          }}
          asChild
        >
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View More</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Download Files</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🔥 Small component for status with dot
function StatusItem({
  label,
  active,
  colors,
}: {
  label: string;
  active: boolean;
  colors: any;
}) {
  return (
    <View style={styles.statusItem}>
      <Text style={[styles.statusText, { color: colors.textLight }]}>
        {label} Status
      </Text>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: active ? "#10B981" : "#EF4444" }, // green or red
        ]}
      />
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
      width: "48%",
      margin: "1%",
    },
    image: {
      width: "100%",
      height: 120,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: "#f0f0f0",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      color: colors.text,
    },
    statusContainer: {
      marginBottom: 16,
    },
    statusItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    statusText: {
      fontSize: 14,
      marginRight: 8,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    buttonContainer: {
      flexDirection: "column",
      gap: 8,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      alignItems: "center",
    },
    buttonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "500",
    },
  });

const styles = StyleSheet.create({
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusText: {
    fontSize: 14,
    marginRight: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
