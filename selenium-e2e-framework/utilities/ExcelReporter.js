const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Logger = require('./Logger');
const env = require('../config/env.config');

class ExcelReporter {
  constructor() {
    this.testResults = [];
    this.failedTests = [];
    this.executionLogs = [];
    this.startTime = new Date();
  }

  logStep(testName, stepDescription, result, remarks = '') {
    this.executionLogs.push({
      timestamp: new Date().toISOString(),
      testName,
      stepDescription,
      result,
      remarks
    });
  }

  addTestResult(result) {
    // result: { testId, module, scenarioName, browser, status, startTime, endTime, duration, failureReason, screenshotPath, url }
    this.testResults.push(result);
    if (result.status === 'FAILED') {
      this.failedTests.push({
        testName: result.scenarioName,
        failureReason: result.failureReason || 'Unknown error',
        screenshotPath: result.screenshotPath || 'N/A',
        browser: result.browser || env.defaultBrowser,
        url: result.url || 'N/A'
      });
    }
  }

  async generateReport(outputPath) {
    const reportDir = outputPath ? path.dirname(outputPath) : path.join(__dirname, '..', 'excel');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const excelFile = outputPath || path.join(reportDir, 'E2E_Report.xlsx');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Enterprise Selenium QA Framework';
    workbook.created = new Date();

    // ----------------------------------------------------
    // Sheet 1: Summary
    // ----------------------------------------------------
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Execution Date', key: 'execDate', width: 22 },
      { header: 'Environment', key: 'env', width: 15 },
      { header: 'Total Tests', key: 'total', width: 14 },
      { header: 'Passed', key: 'passed', width: 12 },
      { header: 'Failed', key: 'failed', width: 12 },
      { header: 'Skipped', key: 'skipped', width: 12 },
      { header: 'Pass Percentage', key: 'passRate', width: 18 },
      { header: 'Execution Duration', key: 'duration', width: 20 }
    ];

    const total = this.testResults.length;
    const passed = this.testResults.filter(t => t.status === 'PASSED').length;
    const failed = this.testResults.filter(t => t.status === 'FAILED').length;
    const skipped = this.testResults.filter(t => t.status === 'SKIPPED').length;
    const passRate = total > 0 ? `${((passed / total) * 100).toFixed(2)}%` : '0%';
    const durationMs = Date.now() - this.startTime.getTime();
    const durationStr = `${(durationMs / 1000).toFixed(2)}s`;

    summarySheet.addRow({
      execDate: this.startTime.toLocaleString(),
      env: env.environment,
      total,
      passed,
      failed,
      skipped,
      passRate,
      duration: durationStr
    });

    // Style Summary Headers
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };

    // ----------------------------------------------------
    // Sheet 2: Test Cases
    // ----------------------------------------------------
    const testCasesSheet = workbook.addWorksheet('Test Cases');
    testCasesSheet.columns = [
      { header: 'Test ID', key: 'testId', width: 15 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Scenario Name', key: 'scenarioName', width: 35 },
      { header: 'Browser', key: 'browser', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Start Time', key: 'startTime', width: 22 },
      { header: 'End Time', key: 'endTime', width: 22 },
      { header: 'Duration', key: 'duration', width: 15 }
    ];

    testCasesSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    testCasesSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };

    this.testResults.forEach(res => {
      const row = testCasesSheet.addRow(res);
      const statusCell = row.getCell('status');
      if (res.status === 'PASSED') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6EFCE' } };
        statusCell.font = { color: { argb: '006100' } };
      } else if (res.status === 'FAILED') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7CE' } };
        statusCell.font = { color: { argb: '9C0006' } };
      }
    });

    // ----------------------------------------------------
    // Sheet 3: Failed Tests
    // ----------------------------------------------------
    const failedSheet = workbook.addWorksheet('Failed Tests');
    failedSheet.columns = [
      { header: 'Test Name', key: 'testName', width: 35 },
      { header: 'Failure Reason', key: 'failureReason', width: 45 },
      { header: 'Screenshot Path', key: 'screenshotPath', width: 40 },
      { header: 'Browser', key: 'browser', width: 15 },
      { header: 'URL', key: 'url', width: 35 }
    ];

    failedSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    failedSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C00000' } };

    this.failedTests.forEach(fail => {
      failedSheet.addRow(fail);
    });

    // ----------------------------------------------------
    // Sheet 4: Execution Logs
    // ----------------------------------------------------
    const logsSheet = workbook.addWorksheet('Execution Logs');
    logsSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 24 },
      { header: 'Test Name', key: 'testName', width: 30 },
      { header: 'Step Description', key: 'stepDescription', width: 45 },
      { header: 'Result', key: 'result', width: 15 },
      { header: 'Remarks', key: 'remarks', width: 30 }
    ];

    logsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    logsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };

    this.executionLogs.forEach(log => {
      logsSheet.addRow(log);
    });

    await workbook.xlsx.writeFile(excelFile);
    Logger.info(`Excel Report successfully created at: ${excelFile}`);
    return excelFile;
  }
}

module.exports = new ExcelReporter();
