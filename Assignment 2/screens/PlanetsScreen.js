import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    async function loadPlanets() {
      const response = await fetch("https://shttps://swapi.tech/api/planets");
      const data = await response.json();
      setPlanets(data.results);
    }
    loadPlanets();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={planets}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              Climate: {item.climate} • Population: {item.population}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  details: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
});

