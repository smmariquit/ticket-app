import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TripDetailsStep } from './TripDetailsStep';
import { FareDetailsStep } from './FareDetailsStep';
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

interface BusTicketingFormProps {
  onShowConfirmation: (formData: FormData) => void;
  resetTrigger?: number; // Add a reset trigger prop
}

const BusTicketingForm: React.FC<BusTicketingFormProps> = ({ onShowConfirmation, resetTrigger }) => {
  const [currentStep, setCurrentStep] = useState(1);
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
    const valid = !!(formData.passengerCategory && formData.fromStop && formData.toStop && formData.fare);
    console.log('🔍 isStep2Valid check:', {
      passengerCategory: formData.passengerCategory,
      fromStop: formData.fromStop,
      toStop: formData.toStop,
      fare: formData.fare,
      result: valid
    });
    return valid;
  };

  const handleNext = () => {
    console.log('🚀 handleNext called - currentStep:', currentStep, 'isStep1Valid:', isStep1Valid(), 'isStep2Valid:', isStep2Valid());
    console.log('📋 Current formData:', formData);
    
    if (currentStep === 1 && isStep1Valid()) {
      console.log('✅ Moving to step 2');
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid()) {
      console.log('✅ Showing confirmation modal');
      console.log('📄 FormData being passed to confirmation:', formData);
      onShowConfirmation(formData);
    } else {
      console.log('❌ Validation failed - Step:', currentStep, 'Step1Valid:', isStep1Valid(), 'Step2Valid:', isStep2Valid());
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
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

  // Reset form when resetTrigger changes
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      resetForm();
    }
  }, [resetTrigger]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      
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
    paddingVertical: 10, // Reduced from 20 to 10
    paddingHorizontal: 15, // Reduced from 20 to 15
    paddingTop: Platform.OS === 'ios' ? 45 : 15, // Reduced from 50 to 45 and 20 to 15
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 20,
  },
});

export default BusTicketingForm;
