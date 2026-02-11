import './src/locales/i18n';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SchemeDetailsScreen } from './src/screens/SchemeDetailsScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SchemeDetailsScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
