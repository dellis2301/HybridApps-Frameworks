import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);

  useEffect(() => {
    async function loadShips() {
      const response = await fetch("https://swapi.tech/api/starships/");
      const data = await response.json();
      setShips(data.results);
    }
    loadShips();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={ships}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              Model: {item.model} • Crew: {item.crew}
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
