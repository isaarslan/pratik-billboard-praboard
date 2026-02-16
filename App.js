import React from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { AdProvider } from './src/context/AdContext';
import { OrderProvider } from './src/context/OrderContext';
import { TVContentProvider } from './src/context/TVContentContext';
import AppNavigator from './src/navigation/AppNavigator';
import TVDisplayScreen from './src/screens/TVDisplay/TVDisplayScreen';

/**
 * TV modu kontrolu:
 * Web'de URL'ye ?tv=PANEL_ID parametresi eklendiginde
 * tam ekran TV Display ekrani gosterilir.
 *
 * Ornek: https://praboard.vercel.app/?tv=1
 */
function getTVPanelId() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('tv');
  }
  return null;
}

export default function App() {
  const tvPanelId = getTVPanelId();

  // TV modu - tam ekran billboard gosterimi
  if (tvPanelId) {
    return (
      <TVContentProvider>
        <TVDisplayScreen panelId={tvPanelId} />
      </TVContentProvider>
    );
  }

  // Normal uygulama modu
  return (
    <SafeAreaProvider>
      <AdProvider>
        <OrderProvider>
          <TVContentProvider>
            <View style={{ flex: 1 }}>
              <StatusBar style="auto" />
              <NavigationProvider>
                {(navigation) => <AppNavigator navigation={navigation} />}
              </NavigationProvider>
            </View>
          </TVContentProvider>
        </OrderProvider>
      </AdProvider>
    </SafeAreaProvider>
  );
}
