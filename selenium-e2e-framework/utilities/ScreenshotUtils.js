const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');

class ScreenshotUtils {
  static async takeScreenshot(driver, screenshotName = 'screenshot') {
    try {
      const screenshotsDir = path.join(__dirname, '..', 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${screenshotName}_${timestamp}.png`;
      const filePath = path.join(screenshotsDir, filename);

      const imageBuffer = await driver.takeScreenshot();
      fs.writeFileSync(filePath, imageBuffer, 'base64');
      Logger.info(`Screenshot captured: ${filePath}`);
      return filePath;
    } catch (error) {
      Logger.error(`Failed to capture screenshot: ${error.message}`);
      return null;
    }
  }
}

module.exports = ScreenshotUtils;
