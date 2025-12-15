import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

export default function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [search, setSearch] = useState(""); // search input
  const [isConnected, setIsConnected] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadShips() {
      if (!isConnected) return;

      try {
        const response = await fetch("https://swapi.tech/api/starships/");
        const data = await response.json();
        setShips(data.results || []);
      } catch (error) {
        console.error("Error fetching ships:", error);
      }
    }

    loadShips();
  }, [isConnected]);

  // Navigate to detail screen
  const handleSwipeLeft = (ship) => {
    navigation.navigate("SpaceshipDetail", {
      shipId: ship.uid,
      shipName: ship.name
    });
  };

  // Filter the ships dynamically based on search
  const filteredShips = ships.filter(ship =>
    ship.name.toLowerCase().includes(search.toLowerCase())
  );

  const LeftAction = () => (
    <View style={styles.leftAction}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>View Details</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      renderLeftActions={LeftAction}
      onSwipeableLeftOpen={() => handleSwipeLeft(item)}
    >
      <TouchableOpacity>
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>Swipe left to view details</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://tse1.mm.bing.net/th/id/OIP.gGhb7rHU4dfCIVa1BoBoDgHaFl?pid=Api&P=0&h=220"
        }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      {!isConnected && (
        <Text style={styles.offlineText}>
          ❌ No Internet Connection — Please reconnect to load starships.
        </Text>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Starships..."
          value={search}
          onChangeText={setSearch} // dynamically filters list
        />
      </View>

      {isConnected ? (
        filteredShips.length > 0 ? (
          <FlatList
            data={filteredShips}
            keyExtractor={(item) => item.uid}
            renderItem={renderItem}
          />
        ) : (
          <Text style={{ padding: 20 }}>No starships found.</Text>
        )
      ) : (
        <Text style={{ padding: 20 }}>
          Unable to load starships while offline.
        </Text>
      )}
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
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  name: { fontSize: 20, fontWeight: "bold" },
  details: { fontSize: 14, opacity: 0.7, marginTop: 2 },
  leftAction: {
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 120,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
});

