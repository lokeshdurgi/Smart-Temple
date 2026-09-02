# Enterprise Appium 2.x Android Mobile E2E Automation Framework

Production-ready End-to-End (E2E) mobile automation framework for Android applications using **Appium 2.x**, **UiAutomator2 Driver**, **Node.js**, **JavaScript (ES6+)**, **Mocha**, **Chai**, **ExcelJS**, **Mochawesome**, **Winston Logger**, and **GitHub Actions**.

---

## Key Features

- **Appium 2.x Architecture**: Uses modern W3C standards with `@appium/relaxed-caps` and `appium-uiautomator2-driver`.
- **Dual Execution Modes**:
  - Direct APK installation (`APK_PATH=./app/app-release.apk`)
  - Pre-installed app testing (`APP_PACKAGE=com.example.app`, `APP_ACTIVITY=com.example.app.MainActivity`)
- **Device Support**: Real Android Devices and Android Emulators (Android 10+ through 15+).
- **Comprehensive Mobile Gestures**: W3C Actions for Tap, Double Tap, Long Press, Swipe (Up, Down, Left, Right), Scroll Until Visible, Drag & Drop, Pinch, and Zoom.
- **Smart AI UI Component Scanner**: Automatically inspects screen DOM/XML hierarchy, discovers form inputs, and generates validation scenarios dynamically.
- **Mobile Failure Capture**: Captures screenshots, Logcat logs, current activity name, and stack traces into `reports/failures/`.
- **4-Sheet Mobile Excel Reporting (`ExcelJS`)**: Automatically generates `excel/Mobile_E2E_Report.xlsx`:
  1. *Summary*: Execution Date, Device Name, Android Version, Total Tests, Passed, Failed, Skipped, Pass %, Execution Duration.
  2. *Test Cases*: Test ID, Module, Scenario, Device, Status, Timestamps, Duration.
  3. *Failed Tests*: Test Name, Failure Reason, Screenshot Path, Device, Android Version, Activity Name.
  4. *Execution Logs*: Timestamp, Test Name, Step, Result, Remarks.
- **Rich HTML Reporting (`Mochawesome`)**: Interactive HTML reports saved under `reports/html/`.
- **CI/CD Integration**: Pre-configured GitHub Actions pipeline (`.github/workflows/appium-e2e.yml`) running Android Emulators on macOS runners.

---

## Project Structure

```
appium-mobile-framework/
├── tests/
│   ├── mobile-auth.test.js
│   ├── mobile-forms.test.js
│   ├── mobile-gestures.test.js
│   └── mobile-navigation-performance.test.js
├── pages/
│   ├── MobileBasePage.js
│   ├── MobileLoginPage.js
│   ├── MobileDashboardPage.js
│   └── MobileFormPage.js
├── utilities/
│   ├── GestureUtils.js
│   ├── DeviceUtils.js
│   ├── PerformanceUtils.js
│   ├── MobileFailureHandler.js
│   ├── MobileExcelReporter.js
│   ├── SmartFormScanner.js
│   └── Logger.js
├── config/
│   └── appium.config.js
├── drivers/
│   └── DriverFactory.js
├── reports/
│   ├── html/
│   └── failures/
├── screenshots/
├── logs/
├── excel/
├── app/
├── .github/workflows/
│   └── appium-e2e.yml
├── .mocharc.json
├── package.json
└── README.md
```

---

## Setup & Execution Instructions

### 1. Prerequisites
- Node.js (v18+ or v20+)
- Java JDK 17+
- Android SDK & ADB configured (`ANDROID_HOME` set in environment)
- Appium 2.x installed globally:
  ```bash
  npm install -g appium
  appium driver install uiautomator2
  ```

### 2. Environment Configuration
Create a `.env` file in `appium-mobile-framework/`:

```env
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
DEVICE_NAME=Pixel_6_API_33
ANDROID_VERSION=13.0
EXECUTION_MODE=apk
APK_PATH=./app/app-release.apk
APP_PACKAGE=com.example.app
APP_ACTIVITY=com.example.app.MainActivity
EXPLICIT_WAIT=20000
```

### 3. Start Appium Server
```bash
appium
```

### 4. Run Test Commands

```bash
# Install dependencies
npm install

# Run all mobile tests
npm test

# Run tests on Android Emulator
npm run test:emulator

# Run tests on Real Device
npm run test:real

# Run tests using APK execution mode
npm run test:apk

# Run tests using Pre-installed App mode
npm run test:installed

# Run Smart AI UI Discovery Tests
npm run test:smart
```

---

## GitHub Actions CI/CD Pipeline

The `.github/workflows/appium-e2e.yml` pipeline:
1. Provisions JDK 17, Android SDK, Appium 2.x, and `uiautomator2` driver.
2. Spawns an Android 13 (API 33) Emulator on macOS hardware-accelerated runner.
3. Executes mobile E2E test suite.
4. Generates 4-sheet Excel report, Mochawesome HTML report, Logcat logs, and screenshots.
5. Archives all artifacts for download.
