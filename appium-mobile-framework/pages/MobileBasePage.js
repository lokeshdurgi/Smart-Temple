const GestureUtils = require('../utilities/GestureUtils');
const DeviceUtils = require('../utilities/DeviceUtils');
const config = require('../config/appium.config');
const Logger = require('../utilities/Logger');

class MobileBasePage {
  constructor(driver) {
    this.driver = driver;
    this.gestures = new GestureUtils(driver);
    this.device = new DeviceUtils(driver);
  }

  async waitForElement(locator, timeout = config.explicitWait) {
    Logger.info(`Waiting for mobile element: ${locator}`);
    const elem = await this.driver.$(locator);
    await elem.waitForDisplayed({ timeout });
    return elem;
  }

  async click(locator) {
    Logger.info(`Clicking mobile element: ${locator}`);
    const elem = await this.waitForElement(locator);
    await elem.click();
  }

  async type(locator, value) {
    Logger.info(`Typing '${value}' into mobile element: ${locator}`);
    const elem = await this.waitForElement(locator);
    await elem.clearValue();
    await elem.setValue(value);
  }

  async getText(locator) {
    const elem = await this.waitForElement(locator);
    return await elem.getText();
  }

  async isDisplayed(locator) {
    try {
      const elem = await this.driver.$(locator);
      return await elem.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async getToastMessage() {
    try {
      const toastElem = await this.driver.$('//android.widget.Toast');
      await toastElem.waitForDisplayed({ timeout: 5000 });
      return await toastElem.getText();
    } catch (e) {
      return null;
    }
  }
}

module.exports = MobileBasePage;
