import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationProvider } from './src/navigation/NavigationContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <NavigationProvider>
          {(navigation) => <AppNavigator navigation={navigation} />}
        </NavigationProvider>
      </View>
    </SafeAreaProvider>
  );
}
