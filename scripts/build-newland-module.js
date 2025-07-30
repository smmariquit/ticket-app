#!/usr/bin/env node

/**
 * Build script for Newland Printer Native Module
 * This script helps compile and link the native Android module
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ANDROID_DIR = path.join(__dirname, '../android');
const APP_DIR = path.join(ANDROID_DIR, 'app');

console.log('🔧 Building Newland Printer Native Module...');

// Check if Android directory exists
if (!fs.existsSync(ANDROID_DIR)) {
  console.error('❌ Android directory not found. Make sure you\'re in a React Native project.');
  process.exit(1);
}

try {
  // Navigate to android directory
  process.chdir(ANDROID_DIR);
  
  console.log('📦 Running gradlew clean...');
  execSync('./gradlew clean', { stdio: 'inherit' });
  
  console.log('🔨 Building Android app...');
  execSync('./gradlew assembleDebug', { stdio: 'inherit' });
  
  console.log('✅ Newland Printer Native Module built successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Install the Newland SDK JAR files in android/app/libs/');
  console.log('2. Update NewlandPrinterModule.java with actual SDK calls');
  console.log('3. Test on your Newland NBB65 device');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
