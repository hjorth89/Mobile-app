import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ onFinish }) {
  async function handleSignIn(method) {
    await AsyncStorage.setItem('onboarded', 'true');
    if (onFinish) onFinish();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Synapse AI</Text>
      <Text style={styles.subtitle}>Your personal productivity co-pilot</Text>
      <Button
        title="Sign in with Google"
        accessibilityLabel="Sign in with Google"
        onPress={() => handleSignIn('google')}
      />
      <Button
        title="Sign in with Apple"
        accessibilityLabel="Sign in with Apple"
        onPress={() => handleSignIn('apple')}
      />
      <Button title="Skip" accessibilityLabel="Skip onboarding" onPress={() => handleSignIn('skip')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});
