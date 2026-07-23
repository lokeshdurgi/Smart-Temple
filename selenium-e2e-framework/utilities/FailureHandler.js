const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');
const ScreenshotUtils = require('./ScreenshotUtils');

class FailureHandler {
  static async handleFailure(driver, testTitle, error, browserName = 'chrome') {
    Logger.error(`TEST FAILURE DETECTED: [${testTitle}] - ${error.message}`);

    const failureDir = path.join(__dirname, '..', 'reports', 'failures');
    if (!fs.existsSync(failureDir)) {
      fs.mkdirSync(failureDir, { recursive: true });
    }

    const sanitizedTitle = testTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `${sanitizedTitle}_${timestamp}`;
    const targetPath = path.join(failureDir, folderName);
    fs.mkdirSync(targetPath, { recursive: true });

    let screenshotPath = null;
    let currentUrl = 'N/A';
    let consoleLogs = [];

    if (driver) {
      try {
        currentUrl = await driver.getCurrentUrl();
      } catch (e) {
        currentUrl = 'Unable to fetch URL';
      }

      try {
        const screenshotFile = await ScreenshotUtils.takeScreenshot(driver, `FAIL_${sanitizedTitle}`);
        if (screenshotFile && fs.existsSync(screenshotFile)) {
          const destScreenshot = path.join(targetPath, 'screenshot.png');
          fs.copyFileSync(screenshotFile, destScreenshot);
          screenshotPath = destScreenshot;
        }
      } catch (e) {
        Logger.error(`Failed saving screenshot to failure directory: ${e.message}`);
      }

      try {
        const logs = await driver.manage().logs().get('browser');
        consoleLogs = logs.map(l => `[${l.level.name}] ${l.timestamp} ${l.message}`);
      } catch (e) {
        consoleLogs = ['Console log capture not supported or failed'];
      }
    }

    const failureDetails = {
      testTitle,
      browser: browserName,
      timestamp: new Date().toISOString(),
      currentUrl,
      failureReason: error.message,
      stackTrace: error.stack,
      consoleLogs,
      screenshotPath
    };

    const infoFilePath = path.join(targetPath, 'failure_details.json');
    fs.writeFileSync(infoFilePath, JSON.stringify(failureDetails, null, 2));

    Logger.info(`Failure details recorded successfully at: ${targetPath}`);

    return failureDetails;
  }
}

module.exports = FailureHandler;
