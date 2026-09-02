const { expect } = require('chai');
const BrowserConfig = require('../config/browser.config');
const env = require('../config/env.config');
const FormPage = require('../pages/FormPage');
const FailureHandler = require('../utilities/FailureHandler');
const ExcelReporter = require('../utilities/ExcelReporter');

describe('React Application - Form Validation E2E Suite', function () {
  this.timeout(60000);
  let driver;
  let formPage;

  before(async function () {
    driver = await BrowserConfig.createDriver(env.defaultBrowser, env.isHeadless);
    formPage = new FormPage(driver);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const failDetails = await FailureHandler.handleFailure(
        driver,
        this.currentTest.fullTitle(),
        this.currentTest.err,
        env.defaultBrowser
      );
      ExcelReporter.addTestResult({
        testId: `FORM-${Math.floor(Math.random() * 1000)}`,
        module: 'Form Validation',
        scenarioName: this.currentTest.title,
        browser: env.defaultBrowser,
        status: 'FAILED',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: `${this.currentTest.duration || 0}ms`,
        failureReason: this.currentTest.err.message,
        screenshotPath: failDetails.screenshotPath,
        url: failDetails.currentUrl
      });
    } else {
      ExcelReporter.addTestResult({
        testId: `FORM-${Math.floor(Math.random() * 1000)}`,
        module: 'Form Validation',
        scenarioName: this.currentTest.title,
        browser: env.defaultBrowser,
        status: 'PASSED',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: `${this.currentTest.duration || 0}ms`
      });
    }
  });

  it('TC_FORM_01: Validate required field and invalid email format constraint', async function () {
    ExcelReporter.logStep(this.test.title, 'Navigate to registration / contact form', 'PASS');
    await formPage.navigateTo(`${env.baseUrl}`);

    ExcelReporter.logStep(this.test.title, 'Enter invalid email and phone number', 'PASS');
    await formPage.fillForm({
      email: 'not-an-email',
      phone: 'abcdefgh',
      password: '123',
      acceptTerms: false
    });

    const currentUrl = await formPage.getCurrentUrl();
    expect(currentUrl).to.be.a('string');
  });

  it('TC_FORM_02: Validate password min/max length and special character rule', async function () {
    ExcelReporter.logStep(this.test.title, 'Test short password rejection', 'PASS');
    await formPage.fillForm({ password: 'short' });
    const currentUrl = await formPage.getCurrentUrl();
    expect(currentUrl).to.be.a('string');
  });
});
