import './src/locales/i18n';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SchemeProvider, SchemeDetailsScreen } from './src/features/scheme-details';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SchemeProvider>
          <SchemeDetailsScreen />
        </SchemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
