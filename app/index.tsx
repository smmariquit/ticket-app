import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Alert } from 'react-native';
import BusTicketingForm from './components/BusTicketingForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import type { FormData } from './components/BusTicketingForm';

export default function Index() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<FormData | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleShowConfirmation = (formData: FormData) => {
    setConfirmationData(formData);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      // Add timestamp
      const tripData = {
        ...confirmationData,
        entered_timestamp: new Date().toISOString(),
      };

      // Here you would normally submit to your backend
      console.log('Trip data:', tripData);
      
      // For now, just show success and reset
      Alert.alert('Success', 'Trip entry recorded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setShowConfirmation(false);
            setConfirmationData(null);
            setResetTrigger(prev => prev + 1); // Trigger form reset
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit trip data. Please try again.');
      console.error('Submit error:', error);
    }
  };

  const resetStep2 = () => {
    // This will be handled by the form component
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2b8aed" />
      <BusTicketingForm 
        onShowConfirmation={handleShowConfirmation} 
        resetTrigger={resetTrigger}
      />
      
      {confirmationData && (
        <ConfirmationModal
          visible={showConfirmation}
          formData={confirmationData}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
          onReset={resetStep2}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});
