const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');
const DeviceUtils = require('./DeviceUtils');
const config = require('../config/appium.config');

class MobileFailureHandler {
  static async handleFailure(driver, testTitle, error) {
    Logger.error(`MOBILE TEST FAILURE DETECTED: [${testTitle}] - ${error.message}`);

    const failureDir = path.join(__dirname, '..', 'reports', 'failures');
    if (!fs.existsSync(failureDir)) {
      fs.mkdirSync(failureDir, { recursive: true });
    }

    const sanitizedTitle = testTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `MOBILE_${sanitizedTitle}_${timestamp}`;
    const targetPath = path.join(failureDir, folderName);
    fs.mkdirSync(targetPath, { recursive: true });

    let screenshotPath = null;
    let currentActivity = 'N/A';
    let deviceLogs = [];

    if (driver) {
      const deviceUtils = new DeviceUtils(driver);
      currentActivity = await deviceUtils.getCurrentActivity();

      try {
        const screenshotBuf = await driver.takeScreenshot();
        screenshotPath = path.join(targetPath, 'screenshot.png');
        fs.writeFileSync(screenshotPath, screenshotBuf, 'base64');
      } catch (e) {
        Logger.error(`Failed to take screenshot: ${e.message}`);
      }

      deviceLogs = await deviceUtils.getLogcatLogs();
    }

    const failureDetails = {
      testTitle,
      device: config.deviceName,
      androidVersion: config.platformVersion,
      timestamp: new Date().toISOString(),
      currentActivity,
      failureReason: error.message,
      stackTrace: error.stack,
      screenshotPath,
      deviceLogs: deviceLogs.slice(-100) // save last 100 log lines
    };

    const infoFilePath = path.join(targetPath, 'failure_details.json');
    fs.writeFileSync(infoFilePath, JSON.stringify(failureDetails, null, 2));

    Logger.info(`Mobile failure details saved at: ${targetPath}`);

    return failureDetails;
  }
}

module.exports = MobileFailureHandler;
