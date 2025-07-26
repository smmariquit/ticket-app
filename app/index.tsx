import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import BusTicketingForm from './components/BusTicketingForm';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2b8aed" />
      <BusTicketingForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});
