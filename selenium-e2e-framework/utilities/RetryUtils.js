const Logger = require('./Logger');
const env = require('../config/env.config');

class RetryUtils {
  static async retry(fn, retries = env.retryCount, delay = 1000) {
    let lastError;
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        Logger.info(`Executing step attempt #${attempt}`);
        return await fn();
      } catch (error) {
        lastError = error;
        Logger.warn(`Attempt #${attempt} failed with error: ${error.message}`);
        if (attempt <= retries) {
          Logger.info(`Retrying step in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    Logger.error(`All ${retries + 1} attempts failed.`);
    throw lastError;
  }
}

module.exports = RetryUtils;
