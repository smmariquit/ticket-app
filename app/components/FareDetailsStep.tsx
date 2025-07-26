import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormPicker } from './FormPicker';
import { TripSummary } from './TripSummary';
import type { FormData } from './BusTicketingForm';
import {
  getPassengerCategoryOptions,
  getStopsForRoute,
  DISCOUNT_PERCENTAGE,
} from '../config/bus-trip-constants';
import { calculateFareWithDiscount } from '../config/fare-matrix';

interface FareDetailsStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const FareDetailsStep: React.FC<FareDetailsStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  isValid,
}) => {
  // Get available stops for the selected route
  const availableStops = formData.route ? getStopsForRoute(formData.route) : [];
  const fromStopOptions = availableStops.map((stop: string) => ({ label: stop, value: stop }));
  
  // Get available destination stops (only stops after the selected origin)
  const fromStopIndex = formData.fromStop ? availableStops.indexOf(formData.fromStop) : -1;
  const availableToStops = fromStopIndex >= 0 ? availableStops.slice(fromStopIndex) : [];
  const toStopOptions = availableToStops.map((stop: string) => ({ label: stop, value: stop }));

  // Calculate fare when relevant fields change
  useEffect(() => {
    if (formData.route && formData.fromStop && formData.toStop && formData.passengerCategory) {
      const calculatedFare = calculateFareWithDiscount(
        formData.route,
        formData.fromStop,
        formData.toStop,
        formData.passengerCategory,
        DISCOUNT_PERCENTAGE
      );
      
      if (calculatedFare !== null && calculatedFare !== formData.fare) {
        updateFormData({ fare: calculatedFare });
      }
    } else if (formData.fare !== null) {
      updateFormData({ fare: null });
    }
  }, [formData.route, formData.fromStop, formData.toStop, formData.passengerCategory, formData.fare, updateFormData]);

  const handleFromStopChange = (value: string) => {
    updateFormData({ 
      fromStop: value,
      // Reset destination if it's no longer valid
      toStop: null,
      fare: null,
    });
  };

  const handleToStopChange = (value: string) => {
    updateFormData({ toStop: value });
  };

  return (
    <View style={styles.container}>
      <TripSummary formData={formData} />
      
      <Text style={styles.title}>Fare Details</Text>
      
      <FormPicker
        label="Passenger Category"
        placeholder="Select passenger category"
        selectedValue={formData.passengerCategory}
        onValueChange={(value) => updateFormData({ passengerCategory: value })}
        options={getPassengerCategoryOptions()}
      />

      <FormPicker
        label="Origin"
        placeholder="Select origin stop"
        selectedValue={formData.fromStop}
        onValueChange={handleFromStopChange}
        options={fromStopOptions}
      />

      <FormPicker
        label="Destination"
        placeholder="Select destination stop"
        selectedValue={formData.toStop}
        onValueChange={handleToStopChange}
        options={toStopOptions}
      />

      {formData.fare !== null && (
        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Fare Amount:</Text>
          <Text style={styles.fareAmount}>₱{formData.fare.toFixed(2)}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.disabledButton]}
          onPress={onNext}
          disabled={!isValid}
        >
          <Text style={[styles.buttonText, !isValid && styles.disabledButtonText]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  fareContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2b8aed',
  },
  fareLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  fareAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2b8aed',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2b8aed',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0c4f7',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#ccc',
  },
});
