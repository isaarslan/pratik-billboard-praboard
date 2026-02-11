import React from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

function RootWrapper({ children }) {
  if (Platform.OS !== 'web') {
    const { GestureHandlerRootView } = require('react-native-gesture-handler');
    return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
  }
  return <View style={{ flex: 1 }}>{children}</View>;
}

export default function App() {
  return (
    <RootWrapper>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </RootWrapper>
  );
}
