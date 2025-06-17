import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PremiumScreen() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('tasks').then(d => {
      if (d) setTasks(JSON.parse(d));
    });
  }, []);

  async function generateInsights() {
    setLoading(true);
    try {
      const prompt = `Provide proactive productivity suggestions based on these tasks: ${tasks.map(t => t.title).join(', ')}.`;
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      setInsights(data.choices?.[0]?.message?.content || 'No insights');
    } catch (e) {
      setInsights('Failed to generate insights');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Button title="Generate Insights" onPress={generateInsights} disabled={loading} />
      <Text style={styles.text}>{insights}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  text: { marginTop: 20 },
});
