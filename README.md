# Welcome to your Expo app 👋

# Bus Ticketing App - React Native Implementation

A React Native implementation of the bus ticketing form with multi-step interface, fare calculation, and offline capabilities.

## Features

- **Multi-Step Form**: Clean interface with step-by-step data entry
- **Real-time Fare Calculation**: Automatic fare computation with discounts
- **Form Validation**: Real-time validation with user feedback
- **Confirmation Modal**: Review details before submission
- **TypeScript Support**: Full type safety throughout the app
- **Responsive Design**: Works on all screen sizes

## Components

### Main Components

- **`BusTicketingForm`**: Main form container with state management
- **`TripDetailsStep`**: Step 1 - Bus, driver, conductor, and route selection
- **`FareDetailsStep`**: Step 2 - Passenger category and origin/destination
- **`ConfirmationModal`**: Final confirmation before submission

### UI Components

- **`FormPicker`**: Custom picker with modal interface
- **`StepIndicator`**: Progress indicator showing current step
- **`TripSummary`**: Summary display of trip details

## Usage

The app follows a simple 2-step process:

### Step 1: Trip Details
1. Select bus number
2. Choose driver
3. Select conductor  
4. Pick route

### Step 2: Fare Details
1. Select passenger category
2. Choose origin stop
3. Select destination stop
4. Review calculated fare

### Step 3: Confirmation
1. Review all details
2. Confirm to submit

## Configuration

All constants are centrally managed in the `config` folder:

- **Bus numbers, drivers, conductors**: `bus-trip-constants.ts`
- **Routes and stops**: `bus-trip-constants.ts`
- **Fare matrix**: `fare-matrix.ts`

## Fare Calculation

- Automatic calculation based on route and stops
- 20% discount for Students, Senior Citizens, and PWDs
- Real-time updates as selections change

## TypeScript

Full TypeScript support with:
- Strongly typed form data
- Type-safe configuration constants
- Proper prop typing for all components

## Running the App

```bash
# Start the development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

## Development

The app is built with:
- React Native + Expo
- TypeScript for type safety
- Modern React hooks for state management
- Custom UI components for better UX

## Next Steps

- Add data persistence with AsyncStorage
- Implement offline sync capabilities
- Add receipt generation
- Connect to backend API
- Add analytics and error tracking
