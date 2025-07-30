import type { FormData } from '../components/BusTicketingForm';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';

// Receipt printer interface
interface ReceiptPrinter {
  isConnected(): Promise<boolean>;
  connect(deviceAddress?: string): Promise<boolean>;
  disconnect(): Promise<boolean>;
  printReceipt(data: FormData): Promise<boolean>;
  getConnectedDevices(): Promise<string[]>;
}

// Sunmi thermal printer implementation
class SunmiReceiptPrinter implements ReceiptPrinter {
  private isInitialized: boolean = false;

  constructor() {
    this.initializePrinter();
  }

  private async initializePrinter() {
    try {
      await SunmiPrinterLibrary.prepare();
      this.isInitialized = true;
      console.log('✅ Sunmi printer initialized successfully');
    } catch (error: any) {
      console.warn('⚠️ Sunmi device not detected, running in demo mode:', error.message);
      this.isInitialized = false; // Still allow the component to work, just disable actual printing
    }
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initializePrinter();
    }
    // Return true for demo mode on non-Sunmi devices
    return true;
  }

  async connect(deviceAddress?: string): Promise<boolean> {
    await this.isConnected();
    return true; // Always return true for demo purposes
  }

  async disconnect(): Promise<boolean> {
    return true;
  }

  async getConnectedDevices(): Promise<string[]> {
    if (this.isInitialized) {
      return ['Sunmi Built-in Printer'];
    }
    return ['Demo Printer (Non-Sunmi Device)'];
  }

  async printReceipt(data: FormData): Promise<boolean> {
    if (!this.isInitialized) {
      console.log('📱 Demo mode: Simulating receipt print on non-Sunmi device');
      // Simulate printing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Demo print completed successfully!');
      return true;
    }

    try {
      console.log('🖨️ Starting actual Sunmi receipt printing...');
      const now = new Date();
      const receiptNumber = `R${now.getTime().toString().slice(-6)}`;

      // Initialize printer
      await SunmiPrinterLibrary.prepare();
      
      // Header
      await SunmiPrinterLibrary.setAlignment('center');
      await SunmiPrinterLibrary.setFontSize(24);
      await SunmiPrinterLibrary.printText('BUS TICKETING SYSTEM\n');
      
      await SunmiPrinterLibrary.setFontSize(18);
      await SunmiPrinterLibrary.printText('=====================================\n');

      // Receipt details
      await SunmiPrinterLibrary.setAlignment('left');
      await SunmiPrinterLibrary.setFontSize(16);
      await SunmiPrinterLibrary.printText(`Receipt #: ${receiptNumber}\n`);
      await SunmiPrinterLibrary.printText(`Date: ${now.toLocaleDateString()}\n`);
      await SunmiPrinterLibrary.printText(`Time: ${now.toLocaleTimeString()}\n`);
      await SunmiPrinterLibrary.printText('-------------------------------------\n');

      // Trip information
      await SunmiPrinterLibrary.printText(`Bus Number: ${data.busNumber}\n`);
      await SunmiPrinterLibrary.printText(`Driver: ${data.driver}\n`);
      await SunmiPrinterLibrary.printText(`Conductor: ${data.conductor}\n`);
      await SunmiPrinterLibrary.printText(`Route: ${data.route}\n`);
      await SunmiPrinterLibrary.printText('-------------------------------------\n');

      // Journey details
      await SunmiPrinterLibrary.printText(`From: ${data.fromStop}\n`);
      await SunmiPrinterLibrary.printText(`To: ${data.toStop}\n`);
      await SunmiPrinterLibrary.printText(`Passenger: ${data.passengerCategory}\n`);
      await SunmiPrinterLibrary.printText('-------------------------------------\n');

      // Fare amount (highlighted)
      await SunmiPrinterLibrary.setAlignment('center');
      await SunmiPrinterLibrary.setFontSize(24);
      await SunmiPrinterLibrary.setTextStyle('bold', true);
      await SunmiPrinterLibrary.printText(`FARE: ₱${data.fare?.toFixed(2)}\n`);
      
      await SunmiPrinterLibrary.setTextStyle('bold', false);
      await SunmiPrinterLibrary.setFontSize(16);
      await SunmiPrinterLibrary.printText('-------------------------------------\n');

      // Footer
      await SunmiPrinterLibrary.setAlignment('center');
      await SunmiPrinterLibrary.printText('Thank you for riding!\n');
      await SunmiPrinterLibrary.printText('Have a safe journey ahead\n');
      await SunmiPrinterLibrary.printText('=====================================\n');

      // Feed paper and cut
      await SunmiPrinterLibrary.lineWrap(3);
      await SunmiPrinterLibrary.cutPaper();

      console.log('✅ Receipt printed successfully on Sunmi device');
      return true;

    } catch (error) {
      console.error('❌ Failed to print receipt on Sunmi device:', error);
      return false;
    }
  }
}

// Factory to create the printer instance
class PrinterService {
  private static instance: ReceiptPrinter;

  static getInstance(): ReceiptPrinter {
    if (!PrinterService.instance) {
      PrinterService.instance = new SunmiReceiptPrinter();
    }
    return PrinterService.instance;
  }
}

export default PrinterService;
