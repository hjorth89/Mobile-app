import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Switch } from 'react-native';

export default function SummarizeScreen() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [url, setUrl] = useState('');
  const [numSentences, setNumSentences] = useState('3');
  const [bullets, setBullets] = useState(false);

  async function summarize() {
    let targetText = text;
    if (url) {
      try {
        const res = await fetch(url);
        targetText = await res.text();
      } catch (e) {
        setSummary('Failed to fetch URL');
        return;
      }
    }

    const lengthPrompt = `in about ${numSentences} sentences`;
    const stylePrompt = bullets ? 'Use bullet points.' : '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Summarize the following text ${lengthPrompt}. ${stylePrompt}\n\n${targetText}`,
          },
        ],
      }),
    });
    const data = await response.json();
    setSummary(data.choices?.[0]?.message?.content || 'No summary');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Optional URL to fetch"
        value={url}
        onChangeText={setUrl}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Enter text to summarize"
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={styles.singleLine}
        keyboardType="number-pad"
        placeholder="Number of sentences"
        value={numSentences}
        onChangeText={setNumSentences}
      />
      <View style={styles.switchRow}>
        <Text>Bullet Points</Text>
        <Switch value={bullets} onValueChange={setBullets} />
      </View>
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
  singleLine: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  result: {
    marginTop: 20,
  },
});
