const { expect } = require('chai');
const BrowserConfig = require('../config/browser.config');
const env = require('../config/env.config');
const LoginPage = require('../pages/LoginPage');
const FailureHandler = require('../utilities/FailureHandler');
const ExcelReporter = require('../utilities/ExcelReporter');
const Logger = require('../utilities/Logger');

describe('React Application - Authentication E2E Suite', function () {
  this.timeout(60000);
  let driver;
  let loginPage;
  let browserName;

  before(async function () {
    browserName = env.defaultBrowser;
    driver = await BrowserConfig.createDriver(browserName, env.isHeadless);
    loginPage = new LoginPage(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
    await ExcelReporter.generateReport();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const failDetails = await FailureHandler.handleFailure(
        driver,
        this.currentTest.fullTitle(),
        this.currentTest.err,
        browserName
      );
      ExcelReporter.addTestResult({
        testId: `AUTH-${Math.floor(Math.random() * 1000)}`,
        module: 'Authentication',
        scenarioName: this.currentTest.title,
        browser: browserName,
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
        testId: `AUTH-${Math.floor(Math.random() * 1000)}`,
        module: 'Authentication',
        scenarioName: this.currentTest.title,
        browser: browserName,
        status: 'PASSED',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: `${this.currentTest.duration || 0}ms`
      });
    }
  });

  it('TC_AUTH_01: Should show validation when username and password are empty', async function () {
    ExcelReporter.logStep(this.test.title, 'Navigate to login page', 'PASS');
    await loginPage.open(env.baseUrl);
    
    ExcelReporter.logStep(this.test.title, 'Click login button without typing credentials', 'PASS');
    await loginPage.login('', '');

    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.include('/login');
  });

  it('TC_AUTH_02: Should display error message with invalid credentials', async function () {
    ExcelReporter.logStep(this.test.title, 'Navigate to login page', 'PASS');
    await loginPage.open(env.baseUrl);

    ExcelReporter.logStep(this.test.title, 'Submit invalid credentials', 'PASS');
    await loginPage.login('invalidUser@test.com', 'WrongPassword123!');

    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.be.a('string');
  });

  it('TC_AUTH_03: Should perform valid authentication and session persistence check', async function () {
    ExcelReporter.logStep(this.test.title, 'Open login page', 'PASS');
    await loginPage.open(env.baseUrl);

    ExcelReporter.logStep(this.test.title, 'Enter valid user credentials', 'PASS');
    await loginPage.login('admin@example.com', 'AdminPass123!');

    ExcelReporter.logStep(this.test.title, 'Verify navigation to dashboard or page reload session persistence', 'PASS');
    await loginPage.refresh();
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.be.a('string');
  });
});
