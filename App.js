import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync(); // para pedir permiso
      if (status !== "granted") {
        setErrorMsg("Ubicación no permitida.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({}); // obtiene la ubi actual
      setLocation(currentLocation);

      // esto para decodificar la ubicación
      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLocationName(address);
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/planisferio.jpg')} 
        style={styles.backgroundImage}
        blurRadius={4} // nivel de desenfoque
      >
        {/* Capa de superposición para el efecto de color blanco */}
        <View style={styles.overlay} />
        <Text style={styles.title}>Ubicación...</Text>

        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : location ? (
          <View style={styles.textContainer}>
            <Text style={styles.text}>Ubicación Actual:</Text>
            <Text style={styles.importantText}>
              Dirección: {locationName?.city}, {locationName?.street}
            </Text>
            <Text style={styles.text}>Latitud: {location.coords.latitude}</Text>
            <Text style={styles.text}>
              Longitud: {location.coords.longitude}
            </Text>
          </View>
        ) : (
          <>
            <ActivityIndicator size="small" color="black" />
            <Text style={styles.text}>Obteniendo ubicación...</Text>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    gap: 10,
    flex: 1,
    paddingTop: 65,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // hace que la capa de opacidad cubra toda la imagen
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // capa blanca con opacidad
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 15,
  },
  textContainer: {
    gap: 10,
    backgroundColor: "#c6b09a",
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#a3805c",
  },
  text: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  importantText: {
    fontSize: 30,
    color: "#333",
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
