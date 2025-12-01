import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, Button, Modal, Image
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedShip, setSelectedShip] = useState("");

  useEffect(() => {
    async function loadShips() {
      try {
        const response = await fetch("https://swapi.tech/api/starships/");
        const data = await response.json();
        const results = data.results || [];
        setShips(results);
      } catch (error) {
        console.error("Error fetching ships:", error);
        setShips([]);
      }
    }
    loadShips();
  }, []);

  const handleSwipe = (shipName) => {
    setSelectedShip(shipName);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>

      {/* Top themed image */}
      <Image
        source={{ uri: "https://tse1.mm.bing.net/th/id/OIP.gGhb7rHU4dfCIVa1BoBoDgHaFl?pid=Api&P=0&h=220" }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Starships..."
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Go" onPress={() => setShowModal(true)} />
      </View>

      {/* Scrollable List */}
      <ScrollView>
        {ships.length > 0 ? (
          ships.map((item) => (
            <Swipeable
              key={item.name}
              onSwipeableOpen={() => handleSwipe(item.name)}
            >
              <View style={styles.item}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>Swipe to view details</Text>
              </View>
            </Swipeable>
          ))
        ) : (
          <Text style={{ padding: 20 }}>Loading ships...</Text>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              {selectedShip
                ? `You swiped: ${selectedShip}`
                : `You searched for: ${search}`}
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

  headerImage: {
    width: "100%",
    height: 150,
    marginBottom: 15,
    borderRadius: 8,
  },

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
