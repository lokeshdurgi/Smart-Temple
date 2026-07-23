const Logger = require('./Logger');

class GestureUtils {
  constructor(driver) {
    this.driver = driver;
  }

  async tap(element) {
    Logger.info('Performing gesture: Tap');
    if (typeof element === 'string') {
      const elem = await this.driver.$(element);
      await elem.click();
    } else {
      await element.click();
    }
  }

  async doubleTap(element) {
    Logger.info('Performing gesture: Double Tap');
    const elem = typeof element === 'string' ? await this.driver.$(element) : element;
    const location = await elem.getLocation();
    const size = await elem.getSize();
    const x = Math.round(location.x + size.width / 2);
    const y = Math.round(location.y + size.height / 2);

    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  async longPress(element, durationMs = 2000) {
    Logger.info(`Performing gesture: Long Press (${durationMs}ms)`);
    const elem = typeof element === 'string' ? await this.driver.$(element) : element;
    const location = await elem.getLocation();
    const size = await elem.getSize();
    const x = Math.round(location.x + size.width / 2);
    const y = Math.round(location.y + size.height / 2);

    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: durationMs },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  async swipe(startX, startY, endX, endY, durationMs = 800) {
    Logger.info(`Performing gesture: Swipe [(${startX},${startY}) -> (${endX},${endY})]`);
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: durationMs, x: endX, y: endY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  async swipeUp(percentage = 0.7) {
    Logger.info('Performing gesture: Swipe Up');
    const { width, height } = await this.driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * percentage);
    const endY = Math.round(height * (1 - percentage));
    await this.swipe(startX, startY, startX, endY);
  }

  async swipeDown(percentage = 0.7) {
    Logger.info('Performing gesture: Swipe Down');
    const { width, height } = await this.driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * (1 - percentage));
    const endY = Math.round(height * percentage);
    await this.swipe(startX, startY, startX, endY);
  }

  async swipeLeft(percentage = 0.8) {
    Logger.info('Performing gesture: Swipe Left');
    const { width, height } = await this.driver.getWindowSize();
    const startY = Math.round(height / 2);
    const startX = Math.round(width * percentage);
    const endX = Math.round(width * (1 - percentage));
    await this.swipe(startX, startY, endX, startY);
  }

  async swipeRight(percentage = 0.8) {
    Logger.info('Performing gesture: Swipe Right');
    const { width, height } = await this.driver.getWindowSize();
    const startY = Math.round(height / 2);
    const startX = Math.round(width * (1 - percentage));
    const endX = Math.round(width * percentage);
    await this.swipe(startX, startY, endX, startY);
  }

  async scrollUntilVisible(locator, maxSwipes = 10) {
    Logger.info(`Scrolling until element visible: ${locator}`);
    let swipes = 0;
    while (swipes < maxSwipes) {
      try {
        const elem = await this.driver.$(locator);
        if (await elem.isDisplayed()) {
          return elem;
        }
      } catch (e) {
        // Element not yet visible
      }
      await this.swipeUp(0.6);
      swipes++;
    }
    throw new Error(`Element ${locator} was not visible after ${maxSwipes} swipes.`);
  }

  async dragAndDrop(sourceElem, targetElem) {
    Logger.info('Performing gesture: Drag and Drop');
    const srcLoc = await sourceElem.getLocation();
    const srcSize = await sourceElem.getSize();
    const tgtLoc = await targetElem.getLocation();
    const tgtSize = await targetElem.getSize();

    const startX = Math.round(srcLoc.x + srcSize.width / 2);
    const startY = Math.round(srcLoc.y + srcSize.height / 2);
    const endX = Math.round(tgtLoc.x + tgtSize.width / 2);
    const endY = Math.round(tgtLoc.y + tgtSize.height / 2);

    await this.swipe(startX, startY, endX, endY, 1500);
  }

  async pinch() {
    Logger.info('Performing gesture: Pinch (Zoom Out)');
    const { width, height } = await this.driver.getWindowSize();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 200, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 800, x: centerX - 50, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 200, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 800, x: centerX + 50, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  async zoom() {
    Logger.info('Performing gesture: Zoom (Zoom In)');
    const { width, height } = await this.driver.getWindowSize();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 50, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 800, x: centerX - 200, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 50, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 800, x: centerX + 200, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }
}

module.exports = GestureUtils;
