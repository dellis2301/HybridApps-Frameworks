import React, { useEffect, useState, useRef } from "react";
import { 
  View, Text, StyleSheet, TextInput, Button, Modal, ScrollView, Animated 
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [search, setSearch] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [swipeModalVisible, setSwipeModalVisible] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState("");

  const fadeAnims = useRef([]).current; // array of Animated.Values

  useEffect(() => {
    async function loadPlanets() {
      try {
        const response = await fetch("https://swapi.tech/api/planets");
        const data = await response.json();
        const results = data.results || [];
        setPlanets(results);

        // Initialize fade values for each planet
        results.forEach((_, index) => {
          fadeAnims[index] = new Animated.Value(0);
        });

        // Start staggered animations
        const animations = results.map((_, index) =>
          Animated.timing(fadeAnims[index], {
            toValue: 1,
            duration: 500,
            delay: index * 150, // stagger by 150ms
            useNativeDriver: true,
          })
        );
        Animated.stagger(150, animations).start();

      } catch (error) {
        console.error("Error fetching planets:", error);
        setPlanets([]);
      }
    }

    loadPlanets();
  }, []);

  const handleSwipe = (planet) => {
    setSelectedPlanet(planet.name);
    setSwipeModalVisible(true);
  };

  return (
    <View style={styles.container}>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Planets..."
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Go" onPress={() => setSearchModalVisible(true)} />
      </View>

      {/* Scrollable Swipeable List with Staggered Fade-in */}
      <ScrollView>
        {planets.length > 0 ? (
          planets.map((planet, index) => (
            <Animated.View
              key={planet.uid}
              style={[styles.item, { opacity: fadeAnims[index] || 0 }]}
            >
              <Swipeable
                onSwipeableOpen={() => handleSwipe(planet)}
                renderRightActions={() => (
                  <View style={styles.swipeBox}>
                    <Text style={{ color: "white" }}>Open</Text>
                  </View>
                )}
              >
                <View>
                  <Text style={styles.name}>{planet.name}</Text>
                  <Text style={styles.details}>
                    Climate: {planet.climate} • Population: {planet.population}
                  </Text>
                </View>
              </Swipeable>
            </Animated.View>
          ))
        ) : (
          <Text style={{ padding: 20 }}>Loading planets...</Text>
        )}
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              You searched for: {search}
            </Text>
            <Button title="Close" onPress={() => setSearchModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Swipe Modal */}
      <Modal
        visible={swipeModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              {selectedPlanet ? `You swiped: ${selectedPlanet}` : ""}
            </Text>
            <Button title="Close" onPress={() => setSwipeModalVisible(false)} />
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },

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

  swipeBox: {
    backgroundColor: "#333",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
});

