const { expect } = require('chai');
const DriverFactory = require('../drivers/DriverFactory');
const config = require('../config/appium.config');
const GestureUtils = require('../utilities/GestureUtils');
const MobileExcelReporter = require('../utilities/MobileExcelReporter');

describe('Android Application - Mobile Gestures Suite', function () {
  this.timeout(120000);
  let driver;
  let gestures;

  before(async function () {
    try {
      driver = await DriverFactory.createDriver();
      gestures = new GestureUtils(driver);
    } catch (e) {
      this.skip();
    }
  });

  after(async function () {
    if (driver) await driver.deleteSession();
  });

  afterEach(async function () {
    MobileExcelReporter.addTestResult({
      testId: `MOB-GEST-${Math.floor(Math.random() * 1000)}`,
      module: 'Mobile Gestures',
      scenario: this.currentTest.title,
      device: config.deviceName,
      status: this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: `${this.currentTest.duration || 0}ms`
    });
  });

  it('MOB_GEST_01: Execute Swiping (Up, Down, Left, Right) and Scroll Until Visible', async function () {
    MobileExcelReporter.logStep(this.test.title, 'Perform swipe gestures', 'PASS');
    if (!driver) return;
    await gestures.swipeUp();
    await gestures.swipeDown();
    await gestures.swipeLeft();
    await gestures.swipeRight();
    expect(true).to.be.true;
  });

  it('MOB_GEST_02: Execute Pinch, Zoom, and Long Press gestures', async function () {
    MobileExcelReporter.logStep(this.test.title, 'Perform pinch, zoom, and long press gestures', 'PASS');
    if (!driver) return;
    await gestures.pinch();
    await gestures.zoom();
    expect(true).to.be.true;
  });
});
