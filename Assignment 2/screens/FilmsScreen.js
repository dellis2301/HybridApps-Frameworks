import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, Button, Modal, ScrollView, Image
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";

export default function FilmsScreen() {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [swipeModalVisible, setSwipeModalVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState("");
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Listen to network status
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch films only if online
    async function loadFilms() {
      if (!isConnected) return;

      try {
        const response = await fetch("https://swapi.tech/api/films");
        const data = await response.json();
        if (data.result && Array.isArray(data.result)) {
          setFilms(data.result);
        } else {
          setFilms([]);
        }
      } catch (error) {
        console.error("Error fetching films:", error);
        setFilms([]);
      }
    }

    loadFilms();
  }, [isConnected]);

  const handleSwipe = (film) => {
    setSelectedFilm(film.title);
    setSwipeModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Top themed image */}
      <Image
        source={{ uri: "https://tse3.mm.bing.net/th/id/OIP._enNoSC2zHYma_iiRg3uZgHaEK?pid=Api&P=0&h=220" }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      {/* Offline message */}
      {!isConnected && (
        <Text style={styles.offlineText}>
          ❌ No Internet Connection — Please reconnect to load films.
        </Text>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Star Wars..."
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Go" onPress={() => setSearchModalVisible(true)} />
      </View>

      {/* ScrollView + Swipeable */}
      <ScrollView>
        {isConnected ? (
          films.length > 0 ? (
            films.map((film) => (
              <Swipeable
                key={film.uid}
                onSwipeableOpen={() => handleSwipe(film)}
                renderRightActions={() => (
                  <View style={styles.swipeBox}>
                    <Text style={{ color: "white" }}>Open</Text>
                  </View>
                )}
              >
                <View style={styles.item}>
                  <Text style={styles.title}>{film.title}</Text>
                  <Text style={styles.subtitle}>
                    Episode {film.episode_id || "N/A"}
                  </Text>
                </View>
              </Swipeable>
            ))
          ) : (
            <Text style={{ padding: 20 }}>Loading films...</Text>
          )
        ) : (
          <Text style={{ padding: 20, fontSize: 16 }}>
            Unable to load films while offline.
          </Text>
        )}
      </ScrollView>

      {/* Search Modal */}
      <Modal visible={searchModalVisible} animationType="slide" transparent={true}>
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
      <Modal visible={swipeModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              {selectedFilm ? `You swiped: ${selectedFilm}` : ""}
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

  headerImage: {
    width: "100%",
    height: 150,
    marginBottom: 15,
    borderRadius: 8,
  },

  offlineText: {
    backgroundColor: "#ffdddd",
    color: "#b00000",
    padding: 10,
    textAlign: "center",
    borderRadius: 8,
    marginBottom: 10,
    fontWeight: "bold",
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

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.7,
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
