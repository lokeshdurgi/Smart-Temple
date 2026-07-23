const Logger = require('./Logger');

class JSUtils {
  constructor(driver) {
    this.driver = driver;
  }

  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  async clickElement(element) {
    Logger.info('Clicking element using JavaScript executor');
    await this.executeScript('arguments[0].click();', element);
  }

  async scrollToElement(element) {
    Logger.info('Scrolling element into view');
    await this.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', element);
  }

  async scrollToBottom() {
    Logger.info('Scrolling to bottom of page');
    await this.executeScript('window.scrollTo(0, document.body.scrollHeight);');
  }

  async scrollToTop() {
    Logger.info('Scrolling to top of page');
    await this.executeScript('window.scrollTo(0, 0);');
  }

  async highlightElement(element, color = 'yellow') {
    await this.executeScript(
      `arguments[0].setAttribute('style', 'border: 3px solid ${color}; background: #FFF000;');`,
      element
    );
  }

  async getInputValue(element) {
    return await this.executeScript('return arguments[0].value;', element);
  }

  async getValidationMessage(element) {
    return await this.executeScript('return arguments[0].validationMessage || "";', element);
  }

  async setInputValue(element, value) {
    await this.executeScript(
      `arguments[0].value = '${value}'; arguments[0].dispatchEvent(new Event('input', { bubbles: true })); arguments[0].dispatchEvent(new Event('change', { bubbles: true }));`,
      element
    );
  }
}

module.exports = JSUtils;
