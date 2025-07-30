const { withAndroidManifest } = require('@expo/config-plugins');

function withSunmiPrinter(config) {
  return withAndroidManifest(config, (config) => {
    try {
      const androidManifest = config.modResults;
      
      // Ensure the manifest structure exists
      if (!androidManifest.manifest) {
        androidManifest.manifest = {};
      }

      // Ensure uses-permission array exists
      if (!androidManifest.manifest['uses-permission']) {
        androidManifest.manifest['uses-permission'] = [];
      }

      // Add necessary permissions for Sunmi printer
      const permissions = [
        'android.permission.BLUETOOTH',
        'android.permission.BLUETOOTH_ADMIN',
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION'
      ];

      permissions.forEach(permission => {
        // Check if permission already exists
        const existingPermission = androidManifest.manifest['uses-permission'].find(
          p => p.$ && p.$['android:name'] === permission
        );
        
        if (!existingPermission) {
          androidManifest.manifest['uses-permission'].push({
            $: { 'android:name': permission }
          });
        }
      });

      // Add uses-feature for Bluetooth if not exists
      if (!androidManifest.manifest['uses-feature']) {
        androidManifest.manifest['uses-feature'] = [];
      }

      const bluetoothFeature = androidManifest.manifest['uses-feature'].find(
        f => f.$ && f.$['android:name'] === 'android.hardware.bluetooth'
      );

      if (!bluetoothFeature) {
        androidManifest.manifest['uses-feature'].push({
          $: { 
            'android:name': 'android.hardware.bluetooth',
            'android:required': 'false'
          }
        });
      }

      console.log('✅ Sunmi printer plugin applied successfully');
      return config;
    } catch (error) {
      console.error('❌ Error in Sunmi printer plugin:', error);
      // Return config unchanged if there's an error
      return config;
    }
  });
}

module.exports = withSunmiPrinter;
