import React from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Box component
function Box({ children }) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxText}>{children}</Text>
    </View>
  );
}

// Column component
function Column({ children }) {
  return <View style={styles.column}>{children}</View>;
}

// Row component
function Row({ children }) {
  return <View style={styles.row}>{children}</View>;
}

// Main App
export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
        <View style={styles.container}>

          {/* Row 1 */}
          <Row>
            {/* LEFT COLUMN */}
            <Column>
              <Box>#1</Box>
              <Box>#2</Box>
              <Box>#5</Box>
              <Box>#6</Box>
              <Box>#9</Box>
              <Box>#10</Box>
            </Column>

            {/* RIGHT COLUMN */}
            <Column>
              <Box>#3</Box>
              <Box>#4</Box>
              <Box>#7</Box>
              <Box>#8</Box>
              <Box>#11</Box>
              <Box>#12</Box>
            </Column>
          </Row>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  column: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-around",
  },
  box: {
    flex: 1,
    backgroundColor: "#60a5fa",
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
