require('dotenv').config();
const path = require('path');

module.exports = {
  appiumHost: process.env.APPIUM_HOST || '127.0.0.1',
  appiumPort: parseInt(process.env.APPIUM_PORT || '4723', 10),
  platformName: 'Android',
  automationName: 'UiAutomator2',
  deviceName: process.env.DEVICE_NAME || 'Android Emulator',
  platformVersion: process.env.ANDROID_VERSION || '13.0',
  udid: process.env.ANDROID_UDID || '',
  executionMode: process.env.EXECUTION_MODE || 'apk', // 'apk' or 'installed'
  apkPath: process.env.APK_PATH || path.join(__dirname, '..', 'app', 'app-release.apk'),
  appPackage: process.env.APP_PACKAGE || 'com.example.app',
  appActivity: process.env.APP_ACTIVITY || 'com.example.app.MainActivity',
  newCommandTimeout: parseInt(process.env.NEW_COMMAND_TIMEOUT || '300', 10),
  noReset: process.env.NO_RESET === 'true',
  fullReset: process.env.FULL_RESET === 'true',
  explicitWait: parseInt(process.env.EXPLICIT_WAIT || '20000', 10)
};
