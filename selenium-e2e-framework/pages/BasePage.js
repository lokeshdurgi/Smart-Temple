const { By } = require('selenium-webdriver');
const WaitUtils = require('../utilities/WaitUtils');
const JSUtils = require('../utilities/JSUtils');
const WindowAlertUtils = require('../utilities/WindowAlertUtils');
const Logger = require('../utilities/Logger');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.wait = new WaitUtils(driver);
    this.js = new JSUtils(driver);
    this.windowAlert = new WindowAlertUtils(driver);
  }

  async navigateTo(url) {
    Logger.info(`Navigating to URL: ${url}`);
    await this.driver.get(url);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async findElement(locator) {
    return await this.wait.waitForElementVisible(locator);
  }

  async findElements(locator) {
    return await this.driver.findElements(locator);
  }

  async click(locator) {
    Logger.info(`Clicking element: ${locator.toString()}`);
    const element = await this.wait.waitForElementClickable(locator);
    await element.click();
  }

  async type(locator, text) {
    Logger.info(`Typing '${text}' into element: ${locator.toString()}`);
    const element = await this.wait.waitForElementVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator) {
    const element = await this.wait.waitForElementVisible(locator);
    return await element.getText();
  }

  async isDisplayed(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async refresh() {
    Logger.info('Refreshing browser page');
    await this.driver.navigate().refresh();
  }

  async back() {
    Logger.info('Browser Back navigation');
    await this.driver.navigate().back();
  }

  async forward() {
    Logger.info('Browser Forward navigation');
    await this.driver.navigate().forward();
  }
}

module.exports = BasePage;
