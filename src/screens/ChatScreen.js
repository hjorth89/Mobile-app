import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
      }),
    });
    const data = await response.json();
    const aiMessage = { id: Date.now().toString() + '-ai', role: 'ai', content: data.choices?.[0]?.message?.content || '' };
    setMessages(prev => [...prev, aiMessage]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={item.role === 'user' ? styles.userText : styles.aiText}>{item.content}</Text>
        )}
      />
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4, marginRight: 10 },
  userText: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6', padding: 6, marginVertical: 4, borderRadius: 4 },
  aiText: { alignSelf: 'flex-start', backgroundColor: '#EEE', padding: 6, marginVertical: 4, borderRadius: 4 },
});
