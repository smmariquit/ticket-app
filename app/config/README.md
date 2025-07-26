# Configuration Constants

This folder contains all the configuration constants extracted from the bus trip entry HTML application, organized for use in the React Native app.

## Files

### `bus-trip-constants.ts`
Main configuration file containing:
- **BUS_NUMBERS**: Array of available bus numbers
- **DRIVERS**: List of all drivers
- **CONDUCTORS**: List of all conductors  
- **PASSENGER_CATEGORIES**: Available passenger categories
- **ROUTES**: Supported routes
- **ROUTE_STOPS**: Route configurations with stops
- **Utility functions**: Helper functions for working with the data

### `fare-matrix.ts`
Fare pricing configuration:
- **FARE_MATRIX**: Complete fare pricing for all route combinations
- **Utility functions**: Functions for fare calculation and discounts

### `index.ts`
Central export file for easy importing

### `bus-numbers.ts`
Legacy file, now imports from `bus-trip-constants.ts`

## Usage Examples

### Basic Import
```typescript
import { 
  BUS_NUMBERS, 
  DRIVERS, 
  CONDUCTORS, 
  PASSENGER_CATEGORIES,
  ROUTES 
} from '@/app/config';
```

### Using Utility Functions
```typescript
import { 
  getBusNumberOptions,
  getDriverOptions,
  getFare,
  calculateFareWithDiscount 
} from '@/app/config';

// Get formatted options for React Native Picker
const busOptions = getBusNumberOptions();
const driverOptions = getDriverOptions();

// Calculate fare with discount
const fare = calculateFareWithDiscount('Naga-Labo', 'Naga', 'Labo', 'Student');
```

### TypeScript Types
```typescript
import type { 
  BusNumber, 
  Driver, 
  Conductor, 
  PassengerCategory, 
  Route 
} from '@/app/config';

interface TripData {
  busNumber: BusNumber;
  driver: Driver;
  conductor: Conductor;
  route: Route;
  passengerCategory: PassengerCategory;
}
```

### React Native Component Example
```tsx
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { getBusNumberOptions } from '@/app/config';

export const BusNumberPicker = ({ value, onValueChange }) => {
  const options = getBusNumberOptions();
  
  return (
    <Picker selectedValue={value} onValueChange={onValueChange}>
      {options.map(option => (
        <Picker.Item 
          key={option.value} 
          label={option.label} 
          value={option.value} 
        />
      ))}
    </Picker>
  );
};
```

## Benefits

1. **Type Safety**: Full TypeScript support with proper types
2. **Centralized**: All constants in one place for easy maintenance
3. **Utility Functions**: Pre-built functions for common operations
4. **Consistent**: Same data structure as the original HTML application
5. **Extensible**: Easy to add new routes, drivers, or fare rules

## Maintenance

To update the constants:
1. Edit the arrays in `bus-trip-constants.ts`
2. Update the fare matrix in `fare-matrix.ts` 
3. TypeScript will automatically validate all usages
4. No need to update multiple files

## Migration from HTML

All the dropdown options and configuration data from the original HTML form have been extracted and organized here:

- HTML `<option>` values → TypeScript arrays
- JavaScript fare matrix → TypeScript types with validation
- Inline constants → Centralized configuration
- Manual validation → TypeScript type checking
