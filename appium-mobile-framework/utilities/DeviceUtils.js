const Logger = require('./Logger');

class DeviceUtils {
  constructor(driver) {
    this.driver = driver;
  }

  async getCurrentActivity() {
    try {
      return await this.driver.getCurrentActivity();
    } catch (e) {
      return 'N/A';
    }
  }

  async getCurrentPackage() {
    try {
      return await this.driver.getCurrentPackage();
    } catch (e) {
      return 'N/A';
    }
  }

  async isKeyboardShown() {
    try {
      return await this.driver.isKeyboardShown();
    } catch (e) {
      return false;
    }
  }

  async hideKeyboard() {
    try {
      if (await this.isKeyboardShown()) {
        Logger.info('Hiding soft keyboard');
        await this.driver.hideKeyboard();
      }
    } catch (e) {
      Logger.warn(`Hide keyboard ignored: ${e.message}`);
    }
  }

  async getLogcatLogs() {
    try {
      const logTypes = await this.driver.getLogTypes();
      if (logTypes.includes('logcat')) {
        const logs = await this.driver.getLogs('logcat');
        return logs.map(l => `[${l.level}] ${l.timestamp} ${l.message}`);
      }
      return ['Logcat log type not available'];
    } catch (e) {
      return [`Logcat capture exception: ${e.message}`];
    }
  }

  async pressBackButton() {
    Logger.info('Pressing Android Hardware Back Button');
    await this.driver.back();
  }

  async relaunchApp() {
    Logger.info('Relaunching Android App');
    await this.driver.activateApp(await this.getCurrentPackage());
  }
}

module.exports = DeviceUtils;
