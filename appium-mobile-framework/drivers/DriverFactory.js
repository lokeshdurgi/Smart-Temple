const { remote } = require('webdriverio');
const config = require('../config/appium.config');
const Logger = require('../utilities/Logger');

class DriverFactory {
  static async createDriver() {
    Logger.info(`Initializing Appium 2.x Session [Automation: ${config.automationName}]`);

    const capabilities = {
      platformName: config.platformName,
      'appium:automationName': config.automationName,
      'appium:deviceName': config.deviceName,
      'appium:platformVersion': config.platformVersion,
      'appium:newCommandTimeout': config.newCommandTimeout,
      'appium:noReset': config.noReset,
      'appium:fullReset': config.fullReset,
      'appium:autoGrantPermissions': true
    };

    if (config.udid) {
      capabilities['appium:udid'] = config.udid;
    }

    if (config.executionMode === 'apk') {
      Logger.info(`Configuring launch via APK path: ${config.apkPath}`);
      capabilities['appium:app'] = config.apkPath;
    } else {
      Logger.info(`Configuring launch via Installed App [Package: ${config.appPackage} | Activity: ${config.appActivity}]`);
      capabilities['appium:appPackage'] = config.appPackage;
      capabilities['appium:appActivity'] = config.appActivity;
    }

    const opts = {
      hostname: config.appiumHost,
      port: config.appiumPort,
      path: '/',
      capabilities
    };

    try {
      const driver = await remote(opts);
      Logger.info('Appium session started successfully.');
      return driver;
    } catch (error) {
      Logger.error(`Failed to start Appium driver session: ${error.message}`);
      throw error;
    }
  }
}

module.exports = DriverFactory;
