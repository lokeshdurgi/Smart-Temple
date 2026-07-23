const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Logger = require('./Logger');
const config = require('../config/appium.config');

class MobileExcelReporter {
  constructor() {
    this.testResults = [];
    this.failedTests = [];
    this.executionLogs = [];
    this.startTime = new Date();
  }

  logStep(testName, step, result, remarks = '') {
    this.executionLogs.push({
      timestamp: new Date().toISOString(),
      testName,
      step,
      result,
      remarks
    });
  }

  addTestResult(result) {
    // result: { testId, module, scenario, device, status, startTime, endTime, duration, failureReason, screenshotPath, activityName }
    this.testResults.push(result);
    if (result.status === 'FAILED') {
      this.failedTests.push({
        testName: result.scenario,
        failureReason: result.failureReason || 'Unknown error',
        screenshotPath: result.screenshotPath || 'N/A',
        device: result.device || config.deviceName,
        androidVersion: config.platformVersion,
        activityName: result.activityName || 'N/A'
      });
    }
  }

  async generateReport(outputPath) {
    const reportDir = outputPath ? path.dirname(outputPath) : path.join(__dirname, '..', 'excel');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const excelFile = outputPath || path.join(reportDir, 'Mobile_E2E_Report.xlsx');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Enterprise Appium QA Framework';
    workbook.created = new Date();

    // Sheet 1: Summary
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Execution Date', key: 'execDate', width: 22 },
      { header: 'Device Name', key: 'deviceName', width: 22 },
      { header: 'Android Version', key: 'androidVer', width: 18 },
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
      deviceName: config.deviceName,
      androidVer: config.platformVersion,
      total,
      passed,
      failed,
      skipped,
      passRate,
      duration: durationStr
    });

    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2F5597' } };

    // Sheet 2: Test Cases
    const testCasesSheet = workbook.addWorksheet('Test Cases');
    testCasesSheet.columns = [
      { header: 'Test ID', key: 'testId', width: 15 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Scenario', key: 'scenario', width: 35 },
      { header: 'Device', key: 'device', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Start Time', key: 'startTime', width: 22 },
      { header: 'End Time', key: 'endTime', width: 22 },
      { header: 'Duration', key: 'duration', width: 15 }
    ];

    testCasesSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    testCasesSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2F5597' } };

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

    // Sheet 3: Failed Tests
    const failedSheet = workbook.addWorksheet('Failed Tests');
    failedSheet.columns = [
      { header: 'Test Name', key: 'testName', width: 35 },
      { header: 'Failure Reason', key: 'failureReason', width: 45 },
      { header: 'Screenshot Path', key: 'screenshotPath', width: 40 },
      { header: 'Device', key: 'device', width: 20 },
      { header: 'Android Version', key: 'androidVersion', width: 18 },
      { header: 'Activity Name', key: 'activityName', width: 30 }
    ];

    failedSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    failedSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C00000' } };

    this.failedTests.forEach(fail => {
      failedSheet.addRow(fail);
    });

    // Sheet 4: Execution Logs
    const logsSheet = workbook.addWorksheet('Execution Logs');
    logsSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 24 },
      { header: 'Test Name', key: 'testName', width: 30 },
      { header: 'Step', key: 'step', width: 45 },
      { header: 'Result', key: 'result', width: 15 },
      { header: 'Remarks', key: 'remarks', width: 30 }
    ];

    logsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    logsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2F5597' } };

    this.executionLogs.forEach(log => {
      logsSheet.addRow(log);
    });

    await workbook.xlsx.writeFile(excelFile);
    Logger.info(`Mobile Excel Report created at: ${excelFile}`);
    return excelFile;
  }
}

module.exports = new MobileExcelReporter();
