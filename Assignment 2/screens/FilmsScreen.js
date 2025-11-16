import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function FilmsScreen() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    async function loadFilms() {
      const response = await fetch("https://swapi.tech/api/films");
      const data = await response.json();
      setFilms(data.results);
    }
    loadFilms();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={films}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>Episode {item.episode_id}</Text>
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

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});
