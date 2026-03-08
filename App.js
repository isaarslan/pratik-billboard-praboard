import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { AdProvider } from './src/context/AdContext';
import { OrderProvider } from './src/context/OrderContext';
import { TVContentProvider } from './src/context/TVContentContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import TVDisplayScreen from './src/screens/TVDisplay/TVDisplayScreen';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.warn('App ErrorBoundary:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Bir sorun olustu</Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 }}>
            {this.state.error?.message || 'Bilinmeyen hata'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({ hasError: false, error: null });
              if (typeof window !== 'undefined') window.location.reload();
            }}
            style={{ backgroundColor: '#FF4B4B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Yeniden Dene</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AdProvider>
            <OrderProvider>
              <TVContentProvider>
                <NotificationProvider>
                  <View style={{ flex: 1 }}>
                    <StatusBar style="auto" />
                    <NavigationProvider>
                      {(navigation) => <AppNavigator navigation={navigation} />}
                    </NavigationProvider>
                  </View>
                </NotificationProvider>
              </TVContentProvider>
            </OrderProvider>
          </AdProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
