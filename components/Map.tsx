import { markers } from '@/components/LocationList';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';

const INITIAL_REGION = {
  latitude: 28.6139, // New Delhi
  longitude: 77.2090,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function Map() {
  const mapRef = useRef<any>(null);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#0ea5e9',
      },
      headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      headerTitle: 'Map View',
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ paddingHorizontal: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Focus</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [colorScheme]);

  const focusMap = () => {
    const delhiRegion = {
      latitude: 28.6139,
      longitude: 77.2090,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };
    mapRef.current?.animateToRegion(delhiRegion, 1000);
  };

  const onMarkerSelected = (marker: any) => {
    Alert.alert(marker.name);
  };

  const calloutPressed = (ev: any) => {
    console.log(ev);
  };

  const onRegionChange = (region: Region) => {
    console.log(region);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.mapCard}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton={Platform.OS === 'android'}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          onRegionChangeComplete={onRegionChange}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              title={marker.name}
              coordinate={marker}
              onPress={() => onMarkerSelected(marker)}
            >
              <Callout onPress={calloutPressed}>
                <View style={styles.callout}>
                  <Text style={styles.title}>{marker.name}</Text>
                  <Text style={styles.subtitle}>
                    Lat: {marker.latitude.toFixed(3)}, Lon:{' '}
                    {marker.longitude.toFixed(3)}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 10,
    width:'100%',
    height:'100%'
  },
  mapCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
     width:'100%',
    height:'100%',
  },
  callout: {
    padding: 8,
    maxWidth: 200,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
  },
});
