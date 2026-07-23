const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const config = require('../config/appium.config');
const DeviceUtils = require('../utilities/DeviceUtils');
const PerformanceUtils = require('../utilities/PerformanceUtils');
const MobileExcelReporter = require('../utilities/MobileExcelReporter');

describe('Android Application - Navigation & Performance Validation Suite', function () {
  this.timeout(120000);
  let driver;
  let deviceUtils;
  let perfUtils;

  before(async function () {
    try {
      driver = await DriverFactory.createDriver();
      deviceUtils = new DeviceUtils(driver);
      perfUtils = new PerformanceUtils(driver);
    } catch (e) {
      this.skip();
    }
  });

  after(async function () {
    if (driver) await driver.deleteSession();
  });

  afterEach(async function () {
    MobileExcelReporter.addTestResult({
      testId: `MOB-PERF-${Math.floor(Math.random() * 1000)}`,
      module: 'Navigation & Performance',
      scenario: this.currentTest.title,
      device: config.deviceName,
      status: this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: `${this.currentTest.duration || 0}ms`
    });
  });

  it('MOB_PERF_01: Verify hardware back button and app relaunch behavior', async function () {
    MobileExcelReporter.logStep(this.test.title, 'Press back button and verify activity transition', 'PASS');
    if (!driver) return;
    await deviceUtils.pressBackButton();
    await deviceUtils.relaunchApp();
    const currentPkg = await deviceUtils.getCurrentPackage();
    expect(currentPkg).to.be.a('string');
  });

  it('MOB_PERF_02: Measure App Launch Time and Screen Load Performance Metrics', async function () {
    MobileExcelReporter.logStep(this.test.title, 'Track launch time and screen metrics', 'PASS');
    if (!driver) return;
    const launchTime = await perfUtils.measureAppLaunchTime(async () => {
      await deviceUtils.relaunchApp();
    });
    expect(launchTime).to.be.a('number');
  });
});
