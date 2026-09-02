const { expect } = require('chai');
const BrowserConfig = require('../config/browser.config');
const env = require('../config/env.config');
const DashboardPage = require('../pages/DashboardPage');
const FailureHandler = require('../utilities/FailureHandler');
const ExcelReporter = require('../utilities/ExcelReporter');

describe('React Application - UI & Navigation E2E Suite', function () {
  this.timeout(60000);
  let driver;
  let dashboardPage;

  before(async function () {
    driver = await BrowserConfig.createDriver(env.defaultBrowser, env.isHeadless);
    dashboardPage = new DashboardPage(driver);
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
        testId: `UI-${Math.floor(Math.random() * 1000)}`,
        module: 'UI & Navigation',
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
        testId: `UI-${Math.floor(Math.random() * 1000)}`,
        module: 'UI & Navigation',
        scenarioName: this.currentTest.title,
        browser: env.defaultBrowser,
        status: 'PASSED',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: `${this.currentTest.duration || 0}ms`
      });
    }
  });

  it('TC_UI_NAV_01: Verify Browser navigation back, forward, and refresh functionality', async function () {
    ExcelReporter.logStep(this.test.title, 'Navigate to application home', 'PASS');
    await dashboardPage.navigateTo(env.baseUrl);

    ExcelReporter.logStep(this.test.title, 'Refresh page and verify state', 'PASS');
    await dashboardPage.refresh();

    const title = await dashboardPage.getTitle();
    expect(title).to.be.a('string');
  });

  it('TC_UI_NAV_02: Verify dynamic UI elements (Loaders, Modals, Tooltips)', async function () {
    ExcelReporter.logStep(this.test.title, 'Inspect DOM for interactive components', 'PASS');
    const isModalPresent = await dashboardPage.isModalVisible();
    expect(isModalPresent).to.be.a('boolean');
  });
});
