const { until } = require('selenium-webdriver');
const Logger = require('./Logger');

class WindowAlertUtils {
  constructor(driver) {
    this.driver = driver;
  }

  async acceptAlert(timeout = 5000) {
    Logger.info('Accepting browser alert');
    await this.driver.wait(until.alertIsPresent(), timeout);
    const alert = await this.driver.switchTo().alert();
    const text = await alert.getText();
    await alert.accept();
    return text;
  }

  async dismissAlert(timeout = 5000) {
    Logger.info('Dismissing browser alert');
    await this.driver.wait(until.alertIsPresent(), timeout);
    const alert = await this.driver.switchTo().alert();
    const text = await alert.getText();
    await alert.dismiss();
    return text;
  }

  async sendKeysToAlert(text, timeout = 5000) {
    Logger.info(`Sending keys '${text}' to prompt alert`);
    await this.driver.wait(until.alertIsPresent(), timeout);
    const alert = await this.driver.switchTo().alert();
    await alert.sendKeys(text);
    await alert.accept();
  }

  async switchToNewTab() {
    Logger.info('Switching to newly opened window/tab');
    const originalWindow = await this.driver.getWindowHandle();
    const windows = await this.driver.getAllWindowHandles();
    for (const handle of windows) {
      if (handle !== originalWindow) {
        await this.driver.switchTo().window(handle);
        return originalWindow;
      }
    }
    return originalWindow;
  }

  async switchToWindow(handle) {
    Logger.info(`Switching to window handle: ${handle}`);
    await this.driver.switchTo().window(handle);
  }

  async closeCurrentWindowAndSwitchBack(originalHandle) {
    Logger.info('Closing current window and switching back');
    await this.driver.close();
    await this.driver.switchTo().window(originalHandle);
  }
}

module.exports = WindowAlertUtils;
