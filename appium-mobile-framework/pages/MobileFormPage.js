const MobileBasePage = require('./MobileBasePage');
const Logger = require('../utilities/Logger');

class MobileFormPage extends MobileBasePage {
  constructor(driver) {
    super(driver);
    this.emailInput = 'id=com.example.app:id/et_email';
    this.phoneInput = 'id=com.example.app:id/et_phone';
    this.passwordInput = 'id=com.example.app:id/et_password';
    this.categorySpinner = 'id=com.example.app:id/spinner_category';
    this.termsCheckBox = 'id=com.example.app:id/cb_terms';
    this.datePickerBtn = 'id=com.example.app:id/btn_date';
    this.submitBtn = 'id=com.example.app:id/btn_submit';
    this.validationError = 'id=com.example.app:id/tv_field_error';
  }

  async fillForm(data) {
    Logger.info('Filling out mobile form inputs');
    if (data.email !== undefined) await this.type(this.emailInput, data.email);
    if (data.phone !== undefined) await this.type(this.phoneInput, data.phone);
    if (data.password !== undefined) await this.type(this.passwordInput, data.password);
    if (data.acceptTerms) {
      const cb = await this.waitForElement(this.termsCheckBox);
      const isChecked = await cb.getAttribute('checked');
      if (isChecked !== 'true') {
        await cb.click();
      }
    }
    await this.device.hideKeyboard();
  }

  async submit() {
    Logger.info('Submitting mobile form');
    await this.click(this.submitBtn);
  }

  async getValidationText() {
    if (await this.isDisplayed(this.validationError)) {
      return await this.getText(this.validationError);
    }
    return '';
  }
}

module.exports = MobileFormPage;
