import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import PlanetsScreen from "./screens/PlanetsScreen";
import SpaceshipsScreen from "./screens/SpaceshipsScreen";
import FilmsScreen from "./screens/FilmsScreen";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const screens = (
    <>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
    </>
  );

  return (
    <NavigationContainer>
      {Platform.OS === "ios" ? (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          {screens}
        </Tab.Navigator>
      ) : (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
          {screens}
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}

