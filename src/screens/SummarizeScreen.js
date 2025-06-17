import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function SummarizeScreen() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  async function summarize() {
    // Placeholder call to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_OPENAI_KEY`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Summarize: ${text}` }],
      }),
    });
    const data = await response.json();
    setSummary(data.choices?.[0]?.message?.content || 'No summary');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Enter text to summarize"
        value={text}
        onChangeText={setText}
      />
      <Button title="Summarize" onPress={summarize} />
      <Text style={styles.result}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    height: 100,
  },
  result: {
    marginTop: 20,
  },
});
