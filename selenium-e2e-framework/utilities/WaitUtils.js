const { until, By } = require('selenium-webdriver');
const env = require('../config/env.config');
const Logger = require('./Logger');

class WaitUtils {
  constructor(driver) {
    this.driver = driver;
    this.defaultTimeout = env.explicitWaitTimeout;
  }

  async waitForElementLocated(locator, timeout = this.defaultTimeout) {
    Logger.info(`Waiting for element located by: ${locator.toString()}`);
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementVisible(locator, timeout = this.defaultTimeout) {
    Logger.info(`Waiting for element visible by: ${locator.toString()}`);
    const element = await this.waitForElementLocated(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async waitForElementClickable(locator, timeout = this.defaultTimeout) {
    Logger.info(`Waiting for element clickable by: ${locator.toString()}`);
    const element = await this.waitForElementVisible(locator, timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  async waitForTextPresent(locator, text, timeout = this.defaultTimeout) {
    Logger.info(`Waiting for text '${text}' in element: ${locator.toString()}`);
    const element = await this.waitForElementLocated(locator, timeout);
    return await this.driver.wait(until.elementTextContains(element, text), timeout);
  }

  async waitForElementStaleness(element, timeout = this.defaultTimeout) {
    Logger.info('Waiting for element staleness from DOM');
    return await this.driver.wait(until.stalenessOf(element), timeout);
  }

  async waitForCondition(conditionFn, message = 'Condition timed out', timeout = this.defaultTimeout, pollInterval = 500) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const result = await conditionFn();
      if (result) return result;
      await this.driver.sleep(pollInterval);
    }
    throw new Error(`WaitUtils.waitForCondition failed: ${message} after ${timeout}ms`);
  }
}

module.exports = WaitUtils;
