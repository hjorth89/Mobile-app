import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'kb_docs';
const SECRET = 'synapse-secret-key';

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
}

function decrypt(cipher) {
  try {
    return CryptoJS.AES.decrypt(cipher, SECRET).toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
}

export default function KnowledgeBaseScreen() {
  const [docs, setDocs] = useState([]);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(d => {
      if (d) {
        try {
          const parsed = JSON.parse(d).map(item => ({
            ...item,
            text: decrypt(item.text)
          }));
          setDocs(parsed);
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    const toStore = docs.map(item => ({ ...item, text: encrypt(item.text) }));
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [docs]);

  async function addDoc() {
    let text = content;
    if (url) {
      try {
        const res = await fetch(url);
        text = await res.text();
      } catch (e) {
        setResult('Failed to fetch URL');
        return;
      }
    }
    const doc = { id: Date.now().toString(), text };
    setDocs(prev => [...prev, doc]);
    setContent('');
    setUrl('');
  }

  async function search() {
    if (!query) return;
    setLoading(true);
    try {
      const prompt = `Answer the query using only the information from these documents:\n${docs.map(d => d.text).join('\n---\n')}\nQuery: ${query}`;
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
      setResult(data.choices?.[0]?.message?.content || 'No result');
    } catch (e) {
      setResult('Failed to search');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Add text or provide URL"
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.singleLine}
        placeholder="Optional URL"
        value={url}
        onChangeText={setUrl}
      />
      <Button title="Add Document" onPress={addDoc} />
      <FlatList
        data={docs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text style={styles.doc}>{item.text.slice(0, 50)}...</Text>}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Ask a question"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={search} disabled={loading} />
      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, height: 80 },
  singleLine: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10 },
  doc: { marginTop: 5, fontStyle: 'italic' },
  result: { marginTop: 20 },
});
