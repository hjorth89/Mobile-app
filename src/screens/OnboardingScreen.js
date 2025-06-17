import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { google } from '../integrations';

export default function OnboardingScreen({ onFinish }) {
  async function handleGoogleSignIn() {
    try {
      const redirectUri =
        process.env.GOOGLE_REDIRECT_URI || AuthSession.makeRedirectUri();
      const authUrl = google.getAuthUrl({
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri,
        scopes: ['profile', 'email'],
      });
      const result = await AuthSession.startAsync({ authUrl });
      if (result.type === 'success' && result.params?.code) {
        const tokens = await google.authenticate({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          redirectUri,
          code: result.params.code,
        });
        await AsyncStorage.setItem(
          'google_tokens',
          JSON.stringify(tokens)
        );
        await AsyncStorage.setItem('onboarded', 'true');
        if (onFinish) onFinish();
      }
    } catch (e) {
      console.error('Google sign-in failed', e);
    }
  }

  async function handleDummySignIn() {
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
        onPress={handleGoogleSignIn}
      />
      <Button
        title="Sign in with Apple"
        accessibilityLabel="Sign in with Apple"
        onPress={handleDummySignIn}
      />
      <Button title="Skip" accessibilityLabel="Skip onboarding" onPress={handleDummySignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});
