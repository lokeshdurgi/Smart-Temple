const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const env = require('./env.config');
const Logger = require('../utilities/Logger');

class BrowserConfig {
  static async createDriver(browserName = env.defaultBrowser, headless = env.isHeadless) {
    Logger.info(`Initializing WebDriver for browser: '${browserName}' | Headless: ${headless}`);
    let builder = new Builder();

    switch (browserName.toLowerCase()) {
      case 'firefox': {
        const firefoxOptions = new firefox.Options();
        if (headless) {
          firefoxOptions.addArguments('-headless');
        }
        firefoxOptions.addArguments(`--width=${env.windowWidth}`);
        firefoxOptions.addArguments(`--height=${env.windowHeight}`);
        builder.forBrowser('firefox').setFirefoxOptions(firefoxOptions);
        break;
      }

      case 'edge': {
        const edgeOptions = new edge.Options();
        if (headless) {
          edgeOptions.addArguments('--headless=new');
        }
        edgeOptions.addArguments(`--window-size=${env.windowWidth},${env.windowHeight}`);
        edgeOptions.addArguments('--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
        builder.forBrowser('MicrosoftEdge').setEdgeOptions(edgeOptions);
        break;
      }

      case 'chrome':
      default: {
        const chromeOptions = new chrome.Options();
        if (headless) {
          chromeOptions.addArguments('--headless=new');
        }
        chromeOptions.addArguments(`--window-size=${env.windowWidth},${env.windowHeight}`);
        chromeOptions.addArguments(
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--remote-allow-origins=*',
          '--disable-blink-features=AutomationControlled'
        );
        builder.forBrowser('chrome').setChromeOptions(chromeOptions);
        break;
      }
    }

    const driver = await builder.build();
    await driver.manage().setTimeouts({
      implicit: env.implicitWaitTimeout,
      pageLoad: env.pageLoadTimeout
    });

    if (!headless) {
      await driver.manage().window().maximize();
    }
    return driver;
  }
}

module.exports = BrowserConfig;
