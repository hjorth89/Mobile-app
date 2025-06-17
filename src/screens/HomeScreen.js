import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Summarize" onPress={() => navigation.navigate('Summarize')} />
      <Button title="Tasks" onPress={() => navigation.navigate('Tasks')} />
      <Button title="Chat" onPress={() => navigation.navigate('Chat')} />
      <Button title="Premium" onPress={() => navigation.navigate('Premium')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  }
});
