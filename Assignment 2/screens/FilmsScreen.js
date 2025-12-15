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

export default function FilmsScreen() {
  const [films, setFilms] = useState([]);
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
    async function loadFilms() {
      if (!isConnected) return;

      try {
        const response = await fetch("https://swapi.tech/api/films");
        const data = await response.json();
        setFilms(data.result || []);
      } catch (error) {
        console.error("Error fetching films:", error);
        setFilms([]);
      }
    }

    loadFilms();
  }, [isConnected]);

  // Optional swipe action (you could navigate to a detail screen)
  const handleSwipeLeft = (film) => {
    navigation.navigate("FilmDetail", { filmId: film.uid, filmTitle: film.title });
  };

  // Filter films based on search input
  const filteredFilms = films.filter(film =>
    film.title.toLowerCase().includes(search.toLowerCase())
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
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>Episode {item.episode_id || "N/A"}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://tse3.mm.bing.net/th/id/OIP._enNoSC2zHYma_iiRg3uZgHaEK?pid=Api&P=0&h=220"
        }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      {!isConnected && (
        <Text style={styles.offlineText}>
          ❌ No Internet Connection — Please reconnect to load films.
        </Text>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Films..."
          value={search}
          onChangeText={setSearch} // dynamic filtering
        />
      </View>

      {isConnected ? (
        filteredFilms.length > 0 ? (
          <FlatList
            data={filteredFilms}
            keyExtractor={(item) => item.uid}
            renderItem={renderItem}
          />
        ) : (
          <Text style={{ padding: 20 }}>No films found.</Text>
        )
      ) : (
        <Text style={{ padding: 20 }}>Unable to load films while offline.</Text>
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

  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 14, opacity: 0.7, marginTop: 2 },

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

