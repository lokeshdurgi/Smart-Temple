const Logger = require('./Logger');

class PerformanceUtils {
  constructor(driver) {
    this.driver = driver;
    this.metrics = [];
  }

  async measureAppLaunchTime(launchAction) {
    Logger.info('Measuring App Launch Time...');
    const start = Date.now();
    await launchAction();
    const duration = Date.now() - start;
    Logger.info(`App Launch Time: ${duration}ms`);
    this.metrics.push({ metric: 'App Launch Time', durationMs: duration, timestamp: new Date().toISOString() });
    return duration;
  }

  async measureScreenLoadTime(screenName, loadCondition) {
    Logger.info(`Measuring Screen Load Time for: [${screenName}]...`);
    const start = Date.now();
    await loadCondition();
    const duration = Date.now() - start;
    Logger.info(`Screen [${screenName}] Load Time: ${duration}ms`);
    this.metrics.push({ metric: `Screen Load (${screenName})`, durationMs: duration, timestamp: new Date().toISOString() });
    return duration;
  }

  getMetrics() {
    return this.metrics;
  }
}

module.exports = PerformanceUtils;
