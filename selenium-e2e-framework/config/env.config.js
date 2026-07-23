require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://react-shopping-cart-67954.firebaseapp.com',
  environment: process.env.NODE_ENV || 'staging',
  defaultBrowser: process.env.CROSS_BROWSER || 'chrome',
  isHeadless: process.env.HEADLESS === 'true',
  explicitWaitTimeout: parseInt(process.env.EXPLICIT_WAIT || '15000', 10),
  implicitWaitTimeout: parseInt(process.env.IMPLICIT_WAIT || '5000', 10),
  pageLoadTimeout: parseInt(process.env.PAGE_LOAD_WAIT || '30000', 10),
  windowWidth: parseInt(process.env.WINDOW_WIDTH || '1920', 10),
  windowHeight: parseInt(process.env.WINDOW_HEIGHT || '1080', 10),
  retryCount: parseInt(process.env.RETRY_COUNT || '1', 10)
};
