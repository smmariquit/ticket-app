import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TripDetailsStep } from './TripDetailsStep';
import { FareDetailsStep } from './FareDetailsStep';
import { ConfirmationModal } from './ConfirmationModal';
import { StepIndicator } from './StepIndicator';
import type { BusNumber, Driver, Conductor, Route, PassengerCategory } from '../config/bus-trip-constants';

export interface FormData {
  // Step 1 - Trip Details
  busNumber: BusNumber | null;
  driver: Driver | null;
  conductor: Conductor | null;
  route: Route | null;
  
  // Step 2 - Fare Details
  passengerCategory: PassengerCategory | null;
  fromStop: string | null;
  toStop: string | null;
  fare: number | null;
}

const BusTicketingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    busNumber: null,
    driver: null,
    conductor: null,
    route: null,
    passengerCategory: null,
    fromStop: null,
    toStop: null,
    fare: null,
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isStep1Valid = () => {
    return !!(formData.busNumber && formData.driver && formData.conductor && formData.route);
  };

  const isStep2Valid = () => {
    return !!(formData.passengerCategory && formData.fromStop && formData.toStop && formData.fare);
  };

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid()) {
      setShowConfirmation(true);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleConfirm = async () => {
    try {
      // Add timestamp
      const tripData = {
        ...formData,
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
            resetForm();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit trip data. Please try again.');
      console.error('Submit error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      busNumber: null,
      driver: null,
      conductor: null,
      route: null,
      passengerCategory: null,
      fromStop: null,
      toStop: null,
      fare: null,
    });
    setCurrentStep(1);
  };

  const resetStep2 = () => {
    setFormData(prev => ({
      ...prev,
      passengerCategory: null,
      fromStop: null,
      toStop: null,
      fare: null,
    }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <StepIndicator currentStep={currentStep} totalSteps={2} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {currentStep === 1 ? (
            <TripDetailsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              isValid={isStep1Valid()}
            />
          ) : (
            <FareDetailsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
              isValid={isStep2Valid()}
            />
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showConfirmation}
        formData={formData}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
        onReset={resetStep2}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#2b8aed',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default BusTicketingForm;
