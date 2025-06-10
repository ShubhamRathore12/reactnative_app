import plc1 from "@/assets/images/1200.jpg";
import plc2 from "@/assets/images/200.jpg";
import DeviceCard from "@/components/DeviceCard";
import { Device } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const sampleDevices: Device[] = [
  {
    id: "1",
    name: "S7-1200",
    model: "PLC Controller",
    deviceStatus: "Active",
    imageUrl: plc1,
  },
  {
    id: "2",
    name: "S7-200",
    model: "PLC Controller",
    deviceStatus: "Active",
    imageUrl: plc2,
  },
];

const locations = ["All Locations", "Location 1", "Location 2"];
const companies = ["All Companies", "Company A", "Company B"];

export default function DevicesScreen() {
  const { user } = useAuthStore();
  const { getColors } = useThemeStore();
  const colors = getColors();
  
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const handleDevicePress = (device: Device) => {
    console.log("Device pressed:", device);
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Devices Overview</Text>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Location Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.filterLabel}>Select Location</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          >
            <Text style={styles.dropdownText}>{selectedLocation}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          {isLocationDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {locations
                .filter((location) => location !== user?.location)
                .map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedLocation(location);
                      setIsLocationDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{location}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.filterLabel}>Select Company</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
          >
            <Text style={styles.dropdownText}>{selectedCompany}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          {/* Company Dropdown */}
          {isCompanyDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {companies
                .filter((company) => company !== user?.company)
                .map((company) => (
                  <TouchableOpacity
                    key={company}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCompany(company);
                      setIsCompanyDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{company}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </View>

      {/* Device List */}
      <FlatList
        data={sampleDevices}
        renderItem={({ item }) => (
          <DeviceCard device={item} onPress={handleDevicePress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.deviceList}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dropdownContainer: {
    width: "48%",
    zIndex: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textLight,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.text,
  },
  dropdownIcon: {
    fontSize: 12,
    color: colors.textLight,
  },
  dropdownMenu: {
    position: "absolute",
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.text,
  },
  deviceList: {
    paddingBottom: 20,
  },
});