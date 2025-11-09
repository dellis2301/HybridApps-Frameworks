import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Task from './components/Task';

export default function App() {
  return (
    <View style={styles.container}>
      
      {/* Today's Task */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's Task</Text>

        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          <Task text={'task 1'}/>
          <Task text={'task 2'}/>
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },

    items: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    tasksWrapper: {
      paddingTop: 80,
      paddingHorizontal: 20,
    },
   
  },
);
