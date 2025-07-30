import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ReceiptPrinter } from './ReceiptPrinter';
import type { FormData } from './BusTicketingForm';

interface ConfirmationModalProps {
  visible: boolean;
  formData: FormData;
  onConfirm: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  formData,
  onConfirm,
  onCancel,
  onReset,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Confirm Trip Details</Text>
          
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>

            {/* Receipt Printer Component */}
            <ReceiptPrinter 
              formData={formData}
              onPrintSuccess={() => {
                Alert.alert(
                  'Success',
                  'Receipt printed successfully! Transaction completed.',
                  [{ text: 'OK', onPress: onConfirm }]
                );
              }}
              onPrintError={(error: string) => {
                Alert.alert(
                  'Print Error',
                  `Failed to print receipt: ${error}\n\nWould you like to continue without printing?`,
                  [
                    { text: 'Try Again', style: 'cancel' },
                    { text: 'Continue', onPress: onConfirm }
                  ]
                );
              }}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface DetailRowProps {
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start', // Changed from 'center' to 'flex-start' to start from top
    alignItems: 'center',
    paddingHorizontal: 10, // Only horizontal padding
    paddingTop: 0, // No top padding to start from very top
    paddingBottom: 10, // Small bottom padding
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    paddingBottom: 25, // Extra bottom padding to ensure buttons aren't cut
    width: '95%', // Increased from default to take up more width
    maxWidth: 500, // Increased max width
    minHeight: '100%', // Increased from 300 to allow more content
    maxHeight: '100%', // Reduced from 100% to leave space for buttons
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    minHeight: 600, 
    marginBottom: 5, // Increased margin to give more space for bottom buttons
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  highlightRow: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2b8aed',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  highlightLabel: {
    color: '#2b8aed',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  highlightValue: {
    color: '#2b8aed',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
