import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, Button, Modal 
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    async function loadPlanets() {
      const response = await fetch("https://swapi.tech/api/planets");
      const data = await response.json();
      setPlanets(data.results);
    }
    loadPlanets();
  }, []);

  const handleSwipe = (itemName) => {
    setSelectedItem(itemName);
    setShowModal(true);
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
        <Button title="Go" onPress={() => setShowModal(true)} />
      </View>

      {/* ScrollView wrapping your list */}
      <ScrollView>
        {planets.map((item) => (
          <Swipeable
            key={item.name}
            onSwipeableOpen={() => handleSwipe(item.name)}
          >
            <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              {/* These fields aren't included in swapi.tech results,
                  so I removed climate/population to prevent errors.
                */}
              <Text style={styles.details}>Swipe to show details</Text>
            </View>
          </Swipeable>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              {selectedItem ? `You swiped: ${selectedItem}` : `You searched: ${search}`}
            </Text>
            <Button title="Close" onPress={() => setShowModal(false)} />
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
