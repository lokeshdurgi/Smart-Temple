# Enterprise Selenium WebDriver E2E Automation Framework for React Applications

Production-ready End-to-End (E2E) automation framework built using **Node.js**, **JavaScript (ES6+)**, **Selenium WebDriver**, **Mocha**, **Chai**, **ExcelJS**, **Mochawesome**, **Winston Logger**, and **GitHub Actions**.

---

## Key Features

- **Page Object Model (POM)**: Decoupled UI element locators and page logic.
- **Cross-Browser & Multi-Mode**: Execution support for Google Chrome, Microsoft Edge, and Mozilla Firefox in Headed & Headless modes.
- **Smart Dynamic Route & Form Discovery**: Scans React DOM routes, discovers form input validation rules dynamically (required, min/max length, regex patterns, email/phone/password formats), and executes validation tests on-the-fly.
- **Automatic Failure Handling**: Captures full-page screenshots, browser console logs, current URL, failure reason, and stack traces stored under `reports/failures/`.
- **4-Sheet Excel Reporting (`ExcelJS`)**: Automatically generates `excel/E2E_Report.xlsx`:
  1. *Summary*: Execution Date, Environment, Total Tests, Passed, Failed, Skipped, Pass %, Duration.
  2. *Test Cases*: Test ID, Module, Scenario Name, Browser, Status, Timestamps, Duration.
  3. *Failed Tests*: Test Name, Failure Reason, Screenshot Path, Browser, URL.
  4. *Execution Logs*: Timestamp, Test Name, Step Description, Result, Remarks.
- **Rich HTML Reporting (`Mochawesome`)**: Interactive HTML reports saved under `reports/html/`.
- **CI/CD Integration**: Pre-configured GitHub Actions workflow (`.github/workflows/selenium-e2e.yml`) with automated artifact retention.

---

## Project Structure

```
selenium-e2e-framework/
├── tests/
│   ├── auth.test.js
│   ├── form-validation.test.js
│   ├── ui-navigation.test.js
│   └── dynamic-discovery.test.js
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   └── FormPage.js
├── utilities/
│   ├── WaitUtils.js
│   ├── JSUtils.js
│   ├── WindowAlertUtils.js
│   ├── ScreenshotUtils.js
│   ├── FailureHandler.js
│   ├── RetryUtils.js
│   ├── ExcelReporter.js
│   ├── DynamicFormScanner.js
│   └── Logger.js
├── config/
│   ├── env.config.js
│   └── browser.config.js
├── reports/
│   ├── html/
│   └── failures/
├── screenshots/
├── logs/
├── excel/
├── .github/workflows/
│   └── selenium-e2e.yml
├── .mocharc.json
├── package.json
└── README.md
```

---

## Quick Start & Execution

### Prerequisites
- Node.js (v18+ or v20+)
- Google Chrome / Firefox / Edge installed

### Installation
```bash
npm install
```

### Execution Commands

```bash
# Run all tests (Default Chrome Headed)
npm test

# Run tests in Google Chrome
npm run test:chrome

# Run tests in Mozilla Firefox
npm run test:firefox

# Run tests in Microsoft Edge
npm run test:edge

# Run tests in Headless Mode
npm run test:headless

# Run Smart Dynamic Route & Form Auto-Discovery Tests
npm run test:dynamic

# Run tests in Parallel
npm run test:parallel
```

---

## Environment Variables Configuration

Create a `.env` file in the project root:

```env
BASE_URL=https://react-shopping-cart-67954.firebaseapp.com
NODE_ENV=staging
CROSS_BROWSER=chrome
HEADLESS=false
EXPLICIT_WAIT=15000
IMPLICIT_WAIT=5000
WINDOW_WIDTH=1920
WINDOW_HEIGHT=1080
RETRY_COUNT=1
```

---

## GitHub Actions CI/CD Pipeline

The workflow automatically executes on every `push` and `pull_request` to `main`/`master` branches:
1. Sets up Node.js v20 & installs browser binaries.
2. Executes headless Selenium test suites.
3. Generates 4-sheet Excel report & Mochawesome HTML report.
4. Archives reports, screenshots, and logs as build artifacts.
