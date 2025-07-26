import { NativeModules, Platform } from 'react-native';
import type { FormData } from '../components/BusTicketingForm';

// Receipt printer interface
interface ReceiptPrinter {
  isConnected(): Promise<boolean>;
  connect(deviceAddress?: string): Promise<boolean>;
  disconnect(): Promise<boolean>;
  printReceipt(data: FormData): Promise<boolean>;
  getConnectedDevices(): Promise<string[]>;
}

// Mock implementation for development
class MockReceiptPrinter implements ReceiptPrinter {
  async isConnected(): Promise<boolean> {
    return true;
  }

  async connect(deviceAddress?: string): Promise<boolean> {
    console.log('Mock: Connecting to printer:', deviceAddress);
    return true;
  }

  async disconnect(): Promise<boolean> {
    console.log('Mock: Disconnecting from printer');
    return true;
  }

  async printReceipt(data: FormData): Promise<boolean> {
    console.log('Mock: Printing receipt:', data);
    
    // Simulate receipt content
    const receipt = this.generateReceiptText(data);
    console.log('Receipt Content:\n', receipt);
    
    return true;
  }

  async getConnectedDevices(): Promise<string[]> {
    return ['Mock Printer 1', 'Mock Printer 2'];
  }

  private generateReceiptText(data: FormData): string {
    const now = new Date();
    const receiptNumber = `R${now.getTime().toString().slice(-6)}`;
    
    return `
=====================================
          BUS TICKETING SYSTEM
=====================================
Receipt #: ${receiptNumber}
Date: ${now.toLocaleDateString()}
Time: ${now.toLocaleTimeString()}
-------------------------------------
Bus Number: ${data.busNumber}
Driver: ${data.driver}
Conductor: ${data.conductor}
Route: ${data.route}
-------------------------------------
From: ${data.fromStop}
To: ${data.toStop}
Passenger: ${data.passengerCategory}
-------------------------------------
Fare Amount: ₱${data.fare?.toFixed(2)}
-------------------------------------
        Thank you for riding!
      Have a safe journey ahead
=====================================
    `;
  }
}

// Thermal printer implementation (for production)
class ThermalReceiptPrinter implements ReceiptPrinter {
  private printerModule: any;

  constructor() {
    // This would be your native thermal printer module
    this.printerModule = NativeModules.ThermalPrinter;
  }

  async isConnected(): Promise<boolean> {
    try {
      return await this.printerModule?.isConnected() || false;
    } catch (error) {
      console.error('Printer connection check failed:', error);
      return false;
    }
  }

  async connect(deviceAddress?: string): Promise<boolean> {
    try {
      return await this.printerModule?.connect(deviceAddress) || false;
    } catch (error) {
      console.error('Printer connection failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      return await this.printerModule?.disconnect() || false;
    } catch (error) {
      console.error('Printer disconnection failed:', error);
      return false;
    }
  }

  async getConnectedDevices(): Promise<string[]> {
    try {
      return await this.printerModule?.getConnectedDevices() || [];
    } catch (error) {
      console.error('Failed to get connected devices:', error);
      return [];
    }
  }

  async printReceipt(data: FormData): Promise<boolean> {
    try {
      const receiptCommands = this.generateESCPOSCommands(data);
      return await this.printerModule?.printRawData(receiptCommands) || false;
    } catch (error) {
      console.error('Receipt printing failed:', error);
      return false;
    }
  }

  private generateESCPOSCommands(data: FormData): string {
    const now = new Date();
    const receiptNumber = `R${now.getTime().toString().slice(-6)}`;
    
    // ESC/POS commands for thermal printers
    const ESC = '\x1B';
    const INIT = `${ESC}@`; // Initialize printer
    const CENTER = `${ESC}a1`; // Center alignment
    const LEFT = `${ESC}a0`; // Left alignment
    const BOLD_ON = `${ESC}E1`; // Bold text on
    const BOLD_OFF = `${ESC}E0`; // Bold text off
    const LARGE_TEXT = `${ESC}!1`; // Large text
    const NORMAL_TEXT = `${ESC}!0`; // Normal text
    const CUT_PAPER = `${ESC}m`; // Cut paper
    const LINE_FEED = '\n';
    
    return `${INIT}${CENTER}${BOLD_ON}${LARGE_TEXT}BUS TICKETING SYSTEM${NORMAL_TEXT}${BOLD_OFF}${LINE_FEED}` +
           `=====================================${LINE_FEED}` +
           `${LEFT}Receipt #: ${receiptNumber}${LINE_FEED}` +
           `Date: ${now.toLocaleDateString()}${LINE_FEED}` +
           `Time: ${now.toLocaleTimeString()}${LINE_FEED}` +
           `-------------------------------------${LINE_FEED}` +
           `Bus Number: ${data.busNumber}${LINE_FEED}` +
           `Driver: ${data.driver}${LINE_FEED}` +
           `Conductor: ${data.conductor}${LINE_FEED}` +
           `Route: ${data.route}${LINE_FEED}` +
           `-------------------------------------${LINE_FEED}` +
           `From: ${data.fromStop}${LINE_FEED}` +
           `To: ${data.toStop}${LINE_FEED}` +
           `Passenger: ${data.passengerCategory}${LINE_FEED}` +
           `-------------------------------------${LINE_FEED}` +
           `${BOLD_ON}Fare Amount: ₱${data.fare?.toFixed(2)}${BOLD_OFF}${LINE_FEED}` +
           `-------------------------------------${LINE_FEED}` +
           `${CENTER}Thank you for riding!${LINE_FEED}` +
           `Have a safe journey ahead${LINE_FEED}` +
           `=====================================${LINE_FEED}` +
           `${LINE_FEED}${LINE_FEED}${LINE_FEED}${CUT_PAPER}`;
  }
}

// Factory to create the appropriate printer instance
class PrinterService {
  private static instance: ReceiptPrinter;

  static getInstance(): ReceiptPrinter {
    if (!PrinterService.instance) {
      // Use mock printer in development, thermal printer in production
      if (__DEV__ || !NativeModules.ThermalPrinter) {
        PrinterService.instance = new MockReceiptPrinter();
      } else {
        PrinterService.instance = new ThermalReceiptPrinter();
      }
    }
    return PrinterService.instance;
  }
}

export default PrinterService;
