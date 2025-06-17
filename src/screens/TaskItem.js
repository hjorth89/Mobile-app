import React from 'react';
import { View, Text, Button, StyleSheet, CheckBox } from 'react-native';

export default function TaskItem({ task, onToggle, onBreakdown }) {
  const completedSub = task.subTasks.filter(t => t.completed).length;
  const progress = task.subTasks.length
    ? completedSub / task.subTasks.length
    : task.completed ? 1 : 0;
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <CheckBox value={task.completed} onValueChange={() => onToggle(task.id)} />
        <View style={styles.info}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.meta}>{task.priority} priority - Due {task.dueDate || 'n/a'}</Text>
        </View>
        {!task.subTasks.length && !task.completed && (
          <Button title="Break Down" onPress={() => onBreakdown(task.id)} />
        )}
      </View>
      {task.subTasks.map(sub => (
        <View key={sub.id} style={styles.sub}>
          <CheckBox value={sub.completed} onValueChange={() => onToggle(task.id, sub.id)} />
          <Text style={styles.subText}>{sub.title}</Text>
        </View>
      ))}
      {task.subTasks.length > 0 && (
        <View style={styles.progress}> 
          <View style={[styles.bar, { width: `${progress * 100}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  header: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: 4 },
  title: { fontWeight: 'bold' },
  meta: { fontSize: 12, color: '#666' },
  sub: { flexDirection: 'row', alignItems: 'center', paddingLeft: 32 },
  subText: { marginLeft: 4 },
  progress: { height: 4, backgroundColor: '#eee', marginTop: 4 },
  bar: { height: 4, backgroundColor: '#4caf50' },
});
