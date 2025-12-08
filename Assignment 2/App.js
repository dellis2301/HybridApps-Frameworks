import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NetInfo from "@react-native-community/netinfo";

import PlanetsScreen from "./screens/PlanetsScreen";
import SpaceshipsScreen from "./screens/SpaceshipsScreen";
import FilmsScreen from "./screens/FilmsScreen";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const screens = (
    <>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
    </>
  );

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {!isConnected && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              ❌ No Internet Connection
            </Text>
          </View>
        )}

        {Platform.OS === "ios" ? (
          <Tab.Navigator screenOptions={{ headerShown: false }}>
            {screens}
          </Tab.Navigator>
        ) : (
          <Drawer.Navigator screenOptions={{ headerShown: false }}>
            {screens}
          </Drawer.Navigator>
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "#ffdddd",
    padding: 8,
    alignItems: "center",
  },
  offlineText: {
    color: "#b00000",
    fontWeight: "bold",
  },
});
