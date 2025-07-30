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
      console.log('Sunmi printer initialized successfully');
    } catch (error: any) {
      console.warn('Sunmi device not supported or initialization failed:', error.message);
      this.isInitialized = false;
    }
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initializePrinter();
    }
    return this.isInitialized;
  }

  async connect(deviceAddress?: string): Promise<boolean> {
    return await this.isConnected();
  }

  async disconnect(): Promise<boolean> {
    // Sunmi printers don't need explicit disconnect
    return true;
  }

  async getConnectedDevices(): Promise<string[]> {
    if (this.isInitialized) {
      return ['Sunmi Built-in Printer'];
    }
    return [];
  }

  async printReceipt(data: FormData): Promise<boolean> {
    if (!this.isInitialized) {
      console.error('Sunmi printer not initialized');
      return false;
    }

    try {
      const now = new Date();
      const receiptNumber = `R${now.getTime().toString().slice(-6)}`;

      // Header
      await SunmiPrinterLibrary.setAlignment('center');
      await SunmiPrinterLibrary.setFontSize(24);
      await SunmiPrinterLibrary.printText('BUS TICKETING SYSTEM\n');
      
      await SunmiPrinterLibrary.setFontSize(16);
      await SunmiPrinterLibrary.printText('=====================================\n');

      // Receipt details
      await SunmiPrinterLibrary.setAlignment('left');
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
      await SunmiPrinterLibrary.setFontSize(20);
      await SunmiPrinterLibrary.setTextStyle('bold', true);
      await SunmiPrinterLibrary.printText(`Fare Amount: ₱${data.fare?.toFixed(2)}\n`);
      
      await SunmiPrinterLibrary.setTextStyle('bold', false);
      await SunmiPrinterLibrary.setFontSize(16);
      await SunmiPrinterLibrary.printText('-------------------------------------\n');

      // Footer
      await SunmiPrinterLibrary.printText('Thank you for riding!\n');
      await SunmiPrinterLibrary.printText('Have a safe journey ahead\n');
      await SunmiPrinterLibrary.printText('=====================================\n');

      // Feed paper and cut
      await SunmiPrinterLibrary.lineWrap(3);
      await SunmiPrinterLibrary.cutPaper();

      console.log('Receipt printed successfully on Sunmi device');
      return true;

    } catch (error) {
      console.error('Failed to print receipt on Sunmi device:', error);
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
