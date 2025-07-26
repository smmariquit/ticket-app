// Bus Trip Application Constants
// This file contains all the dropdown options and configuration data
// used throughout the bus trip entry application

export const BUS_NUMBERS = [
  2001, 2003, 2005, 2006, 2007, 2008, 2009, 2011,
  2016, 2017, 2018, 2019, 2020, 2021, 2022
] as const;

export const DRIVERS = [
  'AAmabillo', 'AAndrade', 'ABriones', 'BDemesa', 'EEstuya',
  'EGangan', 'ERegalario', 'FOco', 'JDDiocampo', 'JElcano',
  'JZape', 'LCorreo', 'LEllazar', 'MRaquid', 'MBautista',
  'NPante', 'RBerzuela', 'REsplana', 'RLlanera', 'RTubig'
] as const;

export const CONDUCTORS = [
  'BookerNA', 'BookerNA2', 'BookerLA', 'BookerDA', 'AZulueta',
  'DNapay', 'ECordova', 'EMarqueses', 'JBolo', 'JMartinez',
  'JOrdovez', 'JSicena', 'JTeves', 'JPReblando', 'KOpao',
  'LBarce', 'MGCanaveras', 'MVelasco', 'NBocio', 'RBernas',
  'RCarumba', 'RManambit', 'ZMBalane'
] as const;

export const PASSENGER_CATEGORIES = [
  'Regular', 'Student', 'Senior Citizen', 'PWD', 'Baggage'
] as const;

export const ROUTES = [
  'Naga-Labo', 'Labo-Naga'
] as const;

// Route configuration with stops
export const ROUTE_STOPS = {
  'Naga-Labo': {
    defaultFrom: 'Naga',
    stops: [
      'Naga', 'Pamplona', 'Libmanan', 'Sipocot', 'Cbsua', 'Calagbangan',
      'Villazar', 'Basud', 'Daet', 'Talisay', 'Vinzons', 'Labo'
    ]
  },
  'Labo-Naga': {
    defaultFrom: 'Labo',
    stops: [
      'Labo', 'Vinzons', 'Talisay', 'Daet', 'Basud', 'Villazar',
      'Calagbangan', 'Cbsua', 'Sipocot', 'Libmanan', 'Pamplona', 'Naga'
    ]
  },
  'Naga-Sorsogon': {
    defaultFrom: 'Naga',
    stops: [
      'Naga', 'Pili', 'Anayan', 'Bula', 'Pawili', 'Baao', 'Nabua', 'Bato', 'Agos', 'Matacon',
      'Polangui', 'Oas', 'Ligao', 'Guinobatan', 'Camalig', 'Daraga', 'Anislag', 'Putiao',
      'Salvacion', 'Cumadcad', 'Castilla', 'Pangpang Sorsogon', 'Sorsogon Diversion', 'SM Sorsogon'
    ]
  },
  'Sorsogon-Naga': {
    defaultFrom: 'SM Sorsogon',
    stops: [
      'SM Sorsogon', 'Sorsogon Diversion', 'Pangpang Sorsogon', 'Castilla', 'Cumadcad', 'Salvacion', 'Putiao', 
      'Anislag', 'Daraga', 'Camalig', 'Guinobatan', 'Ligao', 'Oas', 'Polangui', 'Matacon', 'Agos', 
      'Bato', 'Nabua', 'Baao', 'Pawili', 'Bula', 'Anayan', 'Pili', 'Naga'
    ]
  }
} as const;

// TypeScript types for better type safety
export type BusNumber = typeof BUS_NUMBERS[number];
export type Driver = typeof DRIVERS[number];
export type Conductor = typeof CONDUCTORS[number];
export type PassengerCategory = typeof PASSENGER_CATEGORIES[number];
export type Route = typeof ROUTES[number];
export type RouteStop = typeof ROUTE_STOPS[keyof typeof ROUTE_STOPS]['stops'][number];

// Utility functions for working with the constants
export const getBusNumberOptions = () => BUS_NUMBERS.map(num => ({ label: num.toString(), value: num }));
export const getDriverOptions = () => DRIVERS.map(driver => ({ label: driver, value: driver }));
export const getConductorOptions = () => CONDUCTORS.map(conductor => ({ label: conductor, value: conductor }));
export const getPassengerCategoryOptions = () => PASSENGER_CATEGORIES.map(category => ({ label: category, value: category }));
export const getRouteOptions = () => ROUTES.map(route => ({ label: route, value: route }));
export const getStopsForRoute = (route: Route) => ROUTE_STOPS[route]?.stops || [];
export const getDefaultFromForRoute = (route: Route) => ROUTE_STOPS[route]?.defaultFrom;

// Constants for discount calculations
export const DISCOUNT_CATEGORIES = ['Student', 'Senior Citizen', 'PWD'] as const;
export const DISCOUNT_PERCENTAGE = 0.2; // 20% discount

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_BUS_NUMBER: 'Please select a valid bus number',
  INVALID_DRIVER: 'Please select a valid driver',
  INVALID_CONDUCTOR: 'Please select a valid conductor',
  INVALID_ROUTE: 'Please select a valid route',
  INVALID_PASSENGER_CATEGORY: 'Please select a valid passenger category',
  INVALID_STOPS: 'Please select valid origin and destination stops'
} as const;
