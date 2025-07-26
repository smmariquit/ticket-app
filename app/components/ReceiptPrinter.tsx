import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PrinterService from '../services/PrinterService';
import type { FormData } from './BusTicketingForm';

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

  const checkPrinterConnection = async () => {
    try {
      const printer = PrinterService.getInstance();
      const connected = await printer.isConnected();
      setPrinterConnected(connected);
      return connected;
    } catch (error) {
      console.error('Failed to check printer connection:', error);
      return false;
    }
  };

  const connectToPrinter = async () => {
    try {
      const printer = PrinterService.getInstance();
      const devices = await printer.getConnectedDevices();
      
      if (devices.length === 0) {
        Alert.alert('No Printers Found', 'Please connect a thermal printer to continue.');
        return false;
      }

      // Auto-connect to first available device
      const connected = await printer.connect(devices[0]);
      setPrinterConnected(connected);
      
      if (!connected) {
        Alert.alert('Connection Failed', 'Unable to connect to the printer. Please try again.');
      }
      
      return connected;
    } catch (error) {
      console.error('Failed to connect to printer:', error);
      Alert.alert('Connection Error', 'An error occurred while connecting to the printer.');
      return false;
    }
  };

  const printReceipt = async () => {
    if (!formData.busNumber || !formData.fare) {
      Alert.alert('Invalid Data', 'Please complete all required fields before printing.');
      return;
    }

    setIsPrinting(true);
    
    try {
      // Check connection first
      let connected = await checkPrinterConnection();
      
      // If not connected, try to connect
      if (!connected) {
        connected = await connectToPrinter();
      }
      
      if (!connected) {
        setIsPrinting(false);
        return;
      }

      // Print the receipt
      const printer = PrinterService.getInstance();
      const success = await printer.printReceipt(formData);
      
      if (success) {
        Alert.alert(
          'Receipt Printed',
          'Receipt has been printed successfully!',
          [{ text: 'OK', onPress: onPrintSuccess }]
        );
      } else {
        throw new Error('Print operation failed');
      }
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
      <Text style={styles.title}>Receipt Preview</Text>
      
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'monospace',
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
