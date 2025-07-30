import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { FormData } from './BusTicketingForm';

// Import the new Newland printer service
import NewlandPrinterService from '../services/NewlandPrinterService';

interface ReceiptPrinterProps {
  formData: FormData;
  onPrintSuccess?: () => void;
  onPrintError?: (error: string) => void;
}

export const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({
  formData,
  onPrintSuccess,
  onPrintError,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);
  
  // Initialize the printer service
  const printerService = NewlandPrinterService.getInstance();

  console.log('🖨️ ReceiptPrinter component rendering with formData:', formData);

  const connectToPrinter = async () => {
    console.log('🔌 Attempting to connect to Newland printer...');
    try {
      const success = await printerService.connect();
      setPrinterConnected(success);
      Alert.alert(success ? 'Connected' : 'Connection Failed', 
                  success ? 'Newland printer connected successfully' : 'Failed to connect to Newland printer');
      return success;
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'Failed to connect to printer');
      return false;
    }
  };

  const printReceipt = async () => {
    if (!formData.busNumber || !formData.fare) {
      Alert.alert('Invalid Data', 'Please complete all required fields before printing.');
      return;
    }

    if (!printerConnected) {
      Alert.alert('Not Connected', 'Please connect to printer first');
      return;
    }

    setIsPrinting(true);
    
    try {
      console.log('🖨️ Starting Newland receipt printing...');
      const success = await printerService.printReceipt(formData);
      
      Alert.alert(
        success ? 'Receipt Printed' : 'Print Failed',
        success ? 'Receipt has been printed successfully!' : 'Failed to print receipt',
        [{ text: 'OK', onPress: success ? onPrintSuccess : undefined }]
      );
    } catch (error) {
      console.error('Print failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown printing error';
      Alert.alert('Print Failed', `Unable to print receipt: ${errorMessage}`);
      onPrintError?.(errorMessage);
    } finally {
      setIsPrinting(false);
    }
  };

  const generateReceiptPreview = () => {
    const now = new Date();
    const receiptNumber = `R${now.getTime().toString().slice(-6)}`;
    
    return {
      receiptNumber,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      ...formData,
    };
  };

  const preview = generateReceiptPreview();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Receipt Preview</Text>
      
      <View style={styles.receiptPreview}>
        <Text style={styles.header}>BUS TICKETING SYSTEM</Text>
        <Text style={styles.divider}>=====================================</Text>
        
        <Text style={styles.receiptInfo}>Receipt #: {preview.receiptNumber}</Text>
        <Text style={styles.receiptInfo}>Date: {preview.date}</Text>
        <Text style={styles.receiptInfo}>Time: {preview.time}</Text>
        
        <Text style={styles.divider}>-------------------------------------</Text>
        
        <Text style={styles.tripInfo}>Bus Number: {preview.busNumber}</Text>
        <Text style={styles.tripInfo}>Driver: {preview.driver}</Text>
        <Text style={styles.tripInfo}>Conductor: {preview.conductor}</Text>
        <Text style={styles.tripInfo}>Route: {preview.route}</Text>
        
        <Text style={styles.divider}>-------------------------------------</Text>
        
        <Text style={styles.tripInfo}>From: {preview.fromStop}</Text>
        <Text style={styles.tripInfo}>To: {preview.toStop}</Text>
        <Text style={styles.tripInfo}>Passenger: {preview.passengerCategory}</Text>
        
        <Text style={styles.divider}>-------------------------------------</Text>
        
        <Text style={styles.fareAmount}>Fare Amount: ₱{preview.fare?.toFixed(2)}</Text>
        
        <Text style={styles.divider}>-------------------------------------</Text>
        
        <Text style={styles.footer}>Thank you for riding!</Text>
        <Text style={styles.footer}>Have a safe journey ahead</Text>
      </View>

      <View style={styles.printerStatus}>
        <Text style={styles.statusLabel}>Printer Status:</Text>
        <Text style={[styles.statusText, printerConnected ? styles.connected : styles.disconnected]}>
          {printerConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={connectToPrinter}
          disabled={isPrinting || printerConnected}
        >
          <Text style={styles.connectButtonText}>
            {printerConnected ? 'Connected' : 'Connect Printer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.printButton, (!printerConnected || isPrinting) && styles.disabledButton]}
          onPress={printReceipt}
          disabled={!printerConnected || isPrinting}
        >
          {isPrinting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.printButtonText}>🖨️ Print Receipt</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  receiptPreview: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2b8aed',
    fontFamily: 'monospace',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  divider: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 3,
  },
  receiptInfo: {
    fontSize: 12,
    color: '#333',
    marginVertical: 2,
  },
  tripInfo: {
    fontSize: 12,
    color: '#333',
    marginVertical: 2,
  },
  fareAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b8aed',
    textAlign: 'center',
    marginVertical: 3,
  },
  footer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 1,
  },
  printerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  connected: {
    color: '#28a745',
  },
  disconnected: {
    color: '#dc3545',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  connectButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  printButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  printButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0c4f7',
    opacity: 0.6,
  },
});
