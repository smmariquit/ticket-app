const { withAndroidManifest } = require('@expo/config-plugins');

function withSunmiPrinter(config) {
  return withAndroidManifest(config, config => {
    const androidManifest = config.modResults;
    
    // Add necessary permissions for Sunmi printer
    const permissions = [
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.BLUETOOTH_SCAN'
    ];

    permissions.forEach(permission => {
      if (!androidManifest.manifest['uses-permission']?.find(p => p.$['android:name'] === permission)) {
        if (!androidManifest.manifest['uses-permission']) {
          androidManifest.manifest['uses-permission'] = [];
        }
        androidManifest.manifest['uses-permission'].push({
          $: { 'android:name': permission }
        });
      }
    });

    return config;
  });
}

module.exports = withSunmiPrinter;
