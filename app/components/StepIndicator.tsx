import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Trip Entry</Text>
      <View style={styles.stepContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <View key={stepNumber} style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                isActive && styles.activeStep,
                isCompleted && styles.completedStep,
              ]}>
                <Text style={[
                  styles.stepText,
                  (isActive || isCompleted) && styles.activeStepText,
                ]}>
                  {stepNumber}
                </Text>
              </View>
              <Text style={styles.stepLabel}>
                {stepNumber === 1 ? 'Trip Details' : 'Fare Details'}
              </Text>
              {index < totalSteps - 1 && <View style={styles.stepConnector} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: 'white',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  activeStepText: {
    color: '#2b8aed',
  },
  stepLabel: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  stepConnector: {
    position: 'absolute',
    top: 15,
    left: '100%',
    width: 50,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
