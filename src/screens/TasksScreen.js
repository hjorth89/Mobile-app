import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskItem from './TaskItem';
import { breakDownTask, prioritizeTask } from '../utils/ai';

export default function TasksScreen() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('tasks').then(d => {
      if (d) setTasks(JSON.parse(d));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!title) return;
    const task = {
      id: Date.now().toString(),
      title,
      dueDate,
      priority: prioritizeTask(dueDate),
      completed: false,
      subTasks: [],
    };
    setTasks([...tasks, task]);
    setTitle('');
    setDueDate('');
    scheduleReminder(task);
  }

  function toggleComplete(id, subId) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        if (subId) {
          return {
            ...t,
            subTasks: t.subTasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s)
          };
        }
        return { ...t, completed: !t.completed };
      })
    );
  }

  async function handleBreakdown(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const subs = await breakDownTask(task.title);
    setTasks(prev =>
      prev.map(t => t.id === id ? {
        ...t,
        subTasks: subs.map(s => ({ id: Date.now().toString() + Math.random(), title: s, completed: false })),
      } : t)
    );
  }

  function scheduleReminder(task) {
    if (!task.dueDate) return;
    const ms = new Date(task.dueDate) - new Date();
    if (ms <= 0) return;
    setTimeout(() => {
      Alert.alert('Task Reminder', `Task "${task.title}" is due soon!`);
    }, ms);
  }

  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? completed / tasks.length : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}> 
        <TextInput
          style={styles.input}
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Due date YYYY-MM-DD"
          value={dueDate}
          onChangeText={setDueDate}
        />
        <Button title="Add" onPress={addTask} />
      </View>
      <View style={styles.progress}> 
        <View style={[styles.bar, { width: `${progress * 100}%` }]} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleComplete} onBreakdown={handleBreakdown} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4, marginRight: 10 },
  progress: { height: 8, backgroundColor: '#eee', marginBottom: 10 },
  bar: { height: 8, backgroundColor: '#2196f3' },
});
