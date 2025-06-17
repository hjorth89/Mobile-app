import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import SummarizeScreen from './src/screens/SummarizeScreen';
import TasksScreen from './src/screens/TasksScreen';
import ChatScreen from './src/screens/ChatScreen';
import PremiumScreen from './src/screens/PremiumScreen';
import KnowledgeBaseScreen from './src/screens/KnowledgeBaseScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Summarize" component={SummarizeScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
