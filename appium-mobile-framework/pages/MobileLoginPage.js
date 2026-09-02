const MobileBasePage = require('./MobileBasePage');
const Logger = require('../utilities/Logger');

class MobileLoginPage extends MobileBasePage {
  constructor(driver) {
    super(driver);
    this.usernameInput = 'id=com.example.app:id/et_username';
    this.passwordInput = 'id=com.example.app:id/et_password';
    this.loginBtn = 'id=com.example.app:id/btn_login';
    this.errorBanner = 'id=com.example.app:id/tv_error_message';
    this.logoutBtn = 'id=com.example.app:id/btn_logout';
    this.dashboardTitle = 'id=com.example.app:id/tv_dashboard_title';
  }

  async login(username, password) {
    Logger.info(`Performing Mobile Login with username: '${username}'`);
    if (username !== null && username !== undefined) {
      await this.type(this.usernameInput, username);
    }
    if (password !== null && password !== undefined) {
      await this.type(this.passwordInput, password);
    }
    await this.device.hideKeyboard();
    await this.click(this.loginBtn);
  }

  async getErrorMessage() {
    if (await this.isDisplayed(this.errorBanner)) {
      return await this.getText(this.errorBanner);
    }
    return '';
  }

  async isDashboardDisplayed() {
    return await this.isDisplayed(this.dashboardTitle);
  }

  async logout() {
    Logger.info('Performing Logout on Mobile');
    await this.click(this.logoutBtn);
  }
}

module.exports = MobileLoginPage;
