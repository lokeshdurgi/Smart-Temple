const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../utilities/Logger');

class FormPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.emailInput = By.css('input[name="email"], #email');
    this.phoneInput = By.css('input[name="phone"], #phone');
    this.passwordInput = By.css('input[name="password"], #password');
    this.categoryDropdown = By.css('select[name="category"], #category');
    this.termsCheckbox = By.css('input[type="checkbox"][name="terms"], #terms');
    this.birthDatePicker = By.css('input[type="date"], #dob');
    this.submitBtn = By.css('button[type="submit"], #submit-form');
    this.validationFeedback = By.css('.invalid-feedback, .form-error');
  }

  async fillForm(data) {
    Logger.info('Filling out form with test data');
    if (data.email !== undefined) await this.type(this.emailInput, data.email);
    if (data.phone !== undefined) await this.type(this.phoneInput, data.phone);
    if (data.password !== undefined) await this.type(this.passwordInput, data.password);
    if (data.category !== undefined) {
      const selectElem = await this.findElement(this.categoryDropdown);
      await selectElem.sendKeys(data.category);
    }
    if (data.acceptTerms) {
      const checkbox = await this.findElement(this.termsCheckbox);
      if (!(await checkbox.isSelected())) {
        await checkbox.click();
      }
    }
    if (data.dob !== undefined) await this.type(this.birthDatePicker, data.dob);
  }

  async submit() {
    Logger.info('Submitting form');
    await this.click(this.submitBtn);
  }

  async getValidationMessages() {
    const feedbackElements = await this.findElements(this.validationFeedback);
    const messages = [];
    for (const elem of feedbackElements) {
      messages.push(await elem.getText());
    }
    return messages;
  }
}

module.exports = FormPage;
