import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

export default function Layout({ children }) {
  return (
    <View className='flex-1 items-center bg-white px-2 py-4 dark:bg-[#222]'>
      <StatusBar style='auto' />
      {children}
    </View>
  );
}
