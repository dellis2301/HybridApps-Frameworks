import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";

export default function SpaceshipDetailScreen({ route }) {
  const { shipId, shipName } = route.params;

  const [ship, setShip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShipDetails() {
      try {
        const response = await fetch(
          `https://swapi.tech/api/starships/${shipId}`
        );
        const data = await response.json();
        setShip(data.result.properties);
      } catch (error) {
        console.error("Error loading ship details:", error);
      } finally {
        setLoading(false);
      }
    }

    loadShipDetails();
  }, [shipId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading starship data...</Text>
      </View>
    );
  }

  if (!ship) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Unable to load starship details.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.title}>{shipName}</Text>

      {/* Details Card */}
      <View style={styles.card}>
        <Detail label="Model" value={ship.model} />
        <Detail label="Manufacturer" value={ship.manufacturer} />
        <Detail label="Starship Class" value={ship.starship_class} />
        <Detail label="Cost" value={`${ship.cost_in_credits} credits`} />
        <Detail label="Length" value={`${ship.length} meters`} />
        <Detail label="Crew" value={ship.crew} />
        <Detail label="Passengers" value={ship.passengers} />
        <Detail label="Max Speed" value={ship.max_atmosphering_speed} />
        <Detail label="Hyperdrive Rating" value={ship.hyperdrive_rating} />
        <Detail label="Cargo Capacity" value={ship.cargo_capacity} />
        <Detail label="Consumables" value={ship.consumables} />
      </View>
    </ScrollView>
  );
}

/* Reusable detail row */
function Detail({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Unknown"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15
  },
  detailRow: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555"
  },
  value: {
    fontSize: 16,
    marginTop: 2
  }
});
