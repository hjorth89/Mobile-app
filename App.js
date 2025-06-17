import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import SummarizeScreen from './src/screens/SummarizeScreen';
import TasksScreen from './src/screens/TasksScreen';
import ChatScreen from './src/screens/ChatScreen';
import PremiumScreen from './src/screens/PremiumScreen';
import KnowledgeBaseScreen from './src/screens/KnowledgeBaseScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Summarize" component={SummarizeScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Knowledge" component={KnowledgeBaseScreen} />
      <Tab.Screen name="Premium" component={PremiumScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('onboarded').then(v => {
      if (v) setOnboarded(true);
    });
  }, []);

  function finishOnboarding() {
    setOnboarded(true);
  }

  return (
    <NavigationContainer>
      {onboarded ? (
        <MainTabs />
      ) : (
        <OnboardingScreen onFinish={finishOnboarding} />
      )}
    </NavigationContainer>
  );
}
