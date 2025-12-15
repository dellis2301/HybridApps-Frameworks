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

export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [search, setSearch] = useState("");
  const [isConnected, setIsConnected] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadPlanets() {
      if (!isConnected) return;

      try {
        const response = await fetch("https://swapi.tech/api/planets");
        const data = await response.json();
        setPlanets(data.results || []);
      } catch (error) {
        console.error("Error fetching planets:", error);
        setPlanets([]);
      }
    }

    loadPlanets();
  }, [isConnected]);

  // Swipe action to view details (can navigate to detail screen)
  const handleSwipeLeft = (planet) => {
    navigation.navigate("PlanetDetail", { planetId: planet.uid, planetName: planet.name });
  };

  // Filter planets dynamically
  const filteredPlanets = planets.filter(planet =>
    planet.name.toLowerCase().includes(search.toLowerCase())
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
          <Text style={styles.details}>
            Climate: {item.climate} • Population: {item.population}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://static.vecteezy.com/system/resources/previews/024/448/956/large_2x/space-wallpaper-banner-background-stunning-view-of-a-cosmic-galaxy-with-planets-and-space-objects-elements-of-this-image-furnished-by-nasa-generate-ai-free-photo.jpg" }}
        style={styles.headerImage}
        resizeMode="contain"
      />

      {!isConnected && (
        <Text style={styles.offlineText}>
          ❌ No Internet Connection — Please reconnect to load planets.
        </Text>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Planets..."
          value={search}
          onChangeText={setSearch} // dynamic filtering
        />
      </View>

      {isConnected ? (
        filteredPlanets.length > 0 ? (
          <FlatList
            data={filteredPlanets}
            keyExtractor={(item) => item.uid}
            renderItem={renderItem}
          />
        ) : (
          <Text style={{ padding: 20 }}>No planets found.</Text>
        )
      ) : (
        <Text style={{ padding: 20 }}>Unable to load planets while offline.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerImage: { width: "100%", height: 100, marginBottom: 15 },
  offlineText: { backgroundColor: "#ffdddd", color: "#b00000", padding: 10, textAlign: "center", borderRadius: 8, marginBottom: 10, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  searchInput: { flex: 1, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ccc", backgroundColor: "#f9f9f9", borderRadius: 8, marginBottom: 5, paddingHorizontal: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  details: { fontSize: 14, opacity: 0.7, marginTop: 2 },
  leftAction: { backgroundColor: "#2196F3", justifyContent: "center", alignItems: "flex-start", width: 120, paddingHorizontal: 10, borderRadius: 8, marginBottom: 5 },
});

