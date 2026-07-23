const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../utilities/Logger');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    // Locators
    this.usernameInput = By.css('input[name="username"], input[type="email"], #username, [data-testid="username-input"]');
    this.passwordInput = By.css('input[name="password"], input[type="password"], #password, [data-testid="password-input"]');
    this.loginButton = By.css('button[type="submit"], #login-btn, [data-testid="login-button"]');
    this.errorMessage = By.css('.error-message, .alert-danger, [data-testid="error-message"]');
    this.logoutButton = By.css('#logout-btn, button.logout, [data-testid="logout-button"]');
    this.userProfileHeader = By.css('.user-profile, .dashboard-title, [data-testid="dashboard-header"]');
  }

  async open(baseUrl) {
    await this.navigateTo(`${baseUrl}/login`);
  }

  async login(username, password) {
    Logger.info(`Performing login attempt with username: '${username}'`);
    if (username !== null && username !== undefined) {
      await this.type(this.usernameInput, username);
    }
    if (password !== null && password !== undefined) {
      await this.type(this.passwordInput, password);
    }
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    if (await this.isDisplayed(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async isLoggedIn() {
    return await this.isDisplayed(this.userProfileHeader);
  }

  async logout() {
    Logger.info('Performing logout');
    await this.click(this.logoutButton);
  }

  async getValidationMessage(locatorKey) {
    const locator = locatorKey === 'username' ? this.usernameInput : this.passwordInput;
    const element = await this.findElement(locator);
    return await this.js.getValidationMessage(element);
  }
}

module.exports = LoginPage;
