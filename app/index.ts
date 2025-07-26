// Configuration Module Index
// Central export file for all bus trip application constants

// Re-export all constants from the main configuration files
export * from './config/bus-trip-constants';
export * from './config/fare-matrix';

// Legacy support for existing imports
export { busNumbers } from './config/bus-numbers';
