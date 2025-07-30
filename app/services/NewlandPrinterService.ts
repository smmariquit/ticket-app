import { NativeModules, Platform } from 'react-native';
import type { FormData } from '../components/BusTicketingForm';

// Define the native module interface for Newland printer
interface NewlandPrinterModule {
  initPrinter(): Promise<boolean>;
  printText(text: string, alignment?: number, fontSize?: number): Promise<boolean>;
  printLine(): Promise<boolean>;
  cutPaper(): Promise<boolean>;
  isPrinterReady(): Promise<boolean>;
}

// Receipt printer interface
interface ReceiptPrinter {
  isConnected(): Promise<boolean>;
  connect(deviceAddress?: string): Promise<boolean>;
  disconnect(): Promise<boolean>;
  printReceipt(data: FormData): Promise<boolean>;
  getConnectedDevices(): Promise<string[]>;
}

// Newland thermal printer implementation
class NewlandReceiptPrinter implements ReceiptPrinter {
  private isInitialized: boolean = false;
  private printerModule: NewlandPrinterModule | null = null;

  constructor() {
    this.initializePrinter();
  }

  private async initializePrinter() {
    try {
      // Try to get the Newland printer module
      if (Platform.OS === 'android') {
        this.printerModule = NativeModules.NewlandPrinter;
        
        if (this.printerModule) {
          const initialized = await this.printerModule.initPrinter();
          this.isInitialized = initialized;
          console.log('✅ Newland printer initialized successfully');
        } else {
          console.warn('⚠️ Newland printer module not found, running in demo mode');
          this.isInitialized = false;
        }
      }
    } catch (error: any) {
      console.warn('⚠️ Newland printer not available, running in demo mode:', error.message);
      this.isInitialized = false;
    }
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initializePrinter();
    }
    
    if (this.printerModule) {
      try {
        return await this.printerModule.isPrinterReady();
      } catch (error) {
        console.error('Error checking printer status:', error);
        return false;
      }
    }
    
    // Return true for demo mode on non-Newland devices
    return true;
  }

  async connect(deviceAddress?: string): Promise<boolean> {
    await this.isConnected();
    return true; // Newland printers are typically built-in
  }

  async disconnect(): Promise<boolean> {
    return true;
  }

  async getConnectedDevices(): Promise<string[]> {
    if (this.isInitialized && this.printerModule) {
      return ['Newland Built-in Printer'];
    }
    return ['Demo Printer (Non-Newland Device)'];
  }

  async printReceipt(data: FormData): Promise<boolean> {
    if (!this.isInitialized || !this.printerModule) {
      console.log('📱 Demo mode: Simulating receipt print on non-Newland device');
      // Simulate printing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Demo print completed successfully!');
      return true;
    }

    try {
      console.log('🖨️ Starting actual Newland receipt printing...');
      const now = new Date();
      const receiptNumber = `R${now.getTime().toString().slice(-6)}`;

      // Print header
      await this.printerModule.printText('BUS TICKETING SYSTEM', 1, 24); // Center, large
      await this.printerModule.printText('=====================================', 1, 18);
      await this.printerModule.printLine();

      // Receipt details
      await this.printerModule.printText(`Receipt #: ${receiptNumber}`, 0, 16); // Left align
      await this.printerModule.printText(`Date: ${now.toLocaleDateString()}`, 0, 16);
      await this.printerModule.printText(`Time: ${now.toLocaleTimeString()}`, 0, 16);
      await this.printerModule.printText('-------------------------------------', 1, 16);

      // Trip information
      await this.printerModule.printText(`Bus Number: ${data.busNumber}`, 0, 16);
      await this.printerModule.printText(`Driver: ${data.driver}`, 0, 16);
      await this.printerModule.printText(`Conductor: ${data.conductor}`, 0, 16);
      await this.printerModule.printText(`Route: ${data.route}`, 0, 16);
      await this.printerModule.printText('-------------------------------------', 1, 16);

      // Journey details
      await this.printerModule.printText(`From: ${data.fromStop}`, 0, 16);
      await this.printerModule.printText(`To: ${data.toStop}`, 0, 16);
      await this.printerModule.printText(`Passenger: ${data.passengerCategory}`, 0, 16);
      await this.printerModule.printText('-------------------------------------', 1, 16);

      // Fare amount (highlighted)
      await this.printerModule.printText(`FARE: ₱${data.fare?.toFixed(2)}`, 1, 24); // Center, large
      await this.printerModule.printText('-------------------------------------', 1, 16);

      // Footer
      await this.printerModule.printText('Thank you for riding!', 1, 16);
      await this.printerModule.printText('Have a safe journey ahead', 1, 16);
      await this.printerModule.printText('=====================================', 1, 18);

      // Feed paper and cut
      await this.printerModule.printLine();
      await this.printerModule.printLine();
      await this.printerModule.printLine();
      await this.printerModule.cutPaper();

      console.log('✅ Receipt printed successfully on Newland device');
      return true;

    } catch (error) {
      console.error('❌ Failed to print receipt on Newland device:', error);
      return false;
    }
  }
}

// Factory to create the printer instance
class NewlandPrinterService {
  private static instance: ReceiptPrinter;

  static getInstance(): ReceiptPrinter {
    if (!NewlandPrinterService.instance) {
      NewlandPrinterService.instance = new NewlandReceiptPrinter();
    }
    return NewlandPrinterService.instance;
  }
}

export default NewlandPrinterService;
