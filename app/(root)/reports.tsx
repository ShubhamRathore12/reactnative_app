import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const DEVICE_TYPES = [
  { id: "s7-100", name: "S7-100" },
  { id: "s7-200", name: "S7-200" },
] as const;

type DeviceType = (typeof DEVICE_TYPES)[number]["id"];

export default function ReportsScreen() {
  const { getColors } = useThemeStore();
  const colors = getColors();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("s7-100");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getApiUrl = (deviceType: DeviceType) => {
    switch (deviceType) {
      case "s7-100":
        return "https://grain-backend.onrender.com/api/all700data/getAllData";
      case "s7-200":
        return "https://grain-backend.onrender.com/api/all700data/getAllDataSmart200";
      default:
        return "https://grain-backend.onrender.com/api/all700data/getAllData";
    }
  };

  const downloadReport = async (format: "excel" | "pdf" | "csv") => {
    setIsLoading(true);
    setLoadingType(format);

    try {
      // Fetch data from API based on selected device
      const apiUrl = getApiUrl(selectedDevice);
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch data");
      }

      const data = result.data;

      if (format === "csv") {
        await downloadCSV(data);
      } else if (format === "excel") {
        await downloadExcel(data);
      } else if (format === "pdf") {
        await downloadPDF(data);
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        "Download Failed",
        "Failed to download the report. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const downloadCSV = async (data: any[]) => {
    try {
      if (!data || data.length === 0) {
        Alert.alert("No Data", "No data available to export.");
        return;
      }

      // Get headers from first object
      const headers = Object.keys(data[0]);

      // Create CSV content
      let csvContent = headers.join(",") + "\n";

      data.forEach((row) => {
        const values = headers.map((header) => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || "";
        });
        csvContent += values.join(",") + "\n";
      });

      // Save file
      const fileName = `grain_report_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Success", `CSV file saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error("CSV export error:", error);
      throw error;
    }
  };

  const downloadExcel = async (data: any[]) => {
    try {
      // For Excel, we'll create a simple HTML table that can be opened in Excel
      if (!data || data.length === 0) {
        Alert.alert("No Data", "No data available to export.");
        return;
      }

      const headers = Object.keys(data[0]);

      let htmlContent = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2>Grain Technik Report - ${new Date().toLocaleDateString()}</h2>
            <table>
              <thead>
                <tr>
                  ${headers.map((header) => `<th>${header}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${data
                  .map(
                    (row) =>
                      `<tr>
                    ${headers
                      .map((header) => `<td>${row[header] || ""}</td>`)
                      .join("")}
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const fileName = `grain_report_${
        new Date().toISOString().split("T")[0]
      }.html`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Success", `Excel file saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error("Excel export error:", error);
      throw error;
    }
  };

  const downloadPDF = async (data: any[]) => {
    try {
      // For PDF, we'll create an HTML file that can be converted to PDF
      if (!data || data.length === 0) {
        Alert.alert("No Data", "No data available to export.");
        return;
      }

      const headers = Object.keys(data[0]);

      let htmlContent = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h2 { color: #333; text-align: center; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .header { text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Grain Technik Report</h2>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  ${headers.map((header) => `<th>${header}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${data
                  .map(
                    (row) =>
                      `<tr>
                    ${headers
                      .map((header) => `<td>${row[header] || ""}</td>`)
                      .join("")}
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const fileName = `grain_report_${
        new Date().toISOString().split("T")[0]
      }.html`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Success", `PDF file saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error("PDF export error:", error);
      throw error;
    }
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>
          Download machine data in various formats
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Device Type</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.dropdownButtonText}>
            {DEVICE_TYPES.find((d) => d.id === selectedDevice)?.name ||
              "Select Device"}
          </Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownList}>
            {DEVICE_TYPES.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.dropdownItem,
                  selectedDevice === device.id && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  setSelectedDevice(device.id);
                  setIsDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedDevice === device.id &&
                      styles.dropdownItemTextSelected,
                  ]}
                >
                  {device.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Export Data</Text>
        <Text style={styles.sectionDescription}>
          Choose a format to download the latest machine data
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.exportButton, styles.csvButton]}
            onPress={() => downloadReport("csv")}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="document-text" size={24} color="#059669" />
              <View style={styles.buttonText}>
                <Text style={styles.buttonTitle}>CSV Format</Text>
                <Text style={styles.buttonSubtitle}>
                  Comma-separated values
                </Text>
              </View>
              {isLoading && loadingType === "csv" && (
                <ActivityIndicator size="small" color="#059669" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, styles.excelButton]}
            onPress={() => downloadReport("excel")}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="grid" size={24} color="#0F766E" />
              <View style={styles.buttonText}>
                <Text style={styles.buttonTitle}>Excel Format</Text>
                <Text style={styles.buttonSubtitle}>Spreadsheet format</Text>
              </View>
              {isLoading && loadingType === "excel" && (
                <ActivityIndicator size="small" color="#0F766E" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, styles.pdfButton]}
            onPress={() => downloadReport("pdf")}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="document" size={24} color="#DC2626" />
              <View style={styles.buttonText}>
                <Text style={styles.buttonTitle}>PDF Format</Text>
                <Text style={styles.buttonSubtitle}>Portable document</Text>
              </View>
              {isLoading && loadingType === "pdf" && (
                <ActivityIndicator size="small" color="#DC2626" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Reports include real-time machine data
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              Data is securely fetched from your devices
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="download" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Files are saved to your device for offline access
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 24,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textLight,
      lineHeight: 24,
    },
    section: {
      margin: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: colors.textLight,
      marginBottom: 20,
      lineHeight: 20,
    },
    dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    dropdownButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    dropdownList: {
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: -16,
      marginBottom: 16,
      overflow: "hidden",
    },
    dropdownItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemSelected: {
      backgroundColor: colors.primary + "20",
    },
    dropdownItemText: {
      fontSize: 16,
      color: colors.text,
    },
    dropdownItemTextSelected: {
      color: colors.primary,
      fontWeight: "600",
    },
    buttonContainer: {
      gap: 16,
    },
    exportButton: {
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
    },
    csvButton: {
      backgroundColor: "#ECFDF5",
      borderColor: "#059669",
    },
    excelButton: {
      backgroundColor: "#F0FDFA",
      borderColor: "#0F766E",
    },
    pdfButton: {
      backgroundColor: "#FEF2F2",
      borderColor: "#DC2626",
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    buttonText: {
      flex: 1,
      marginLeft: 16,
    },
    buttonTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    buttonSubtitle: {
      fontSize: 14,
      color: colors.textLight,
    },
    infoCard: {
      gap: 16,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    infoText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
  });
