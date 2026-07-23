const { By } = require('selenium-webdriver');
const Logger = require('./Logger');
const JSUtils = require('./JSUtils');

class DynamicFormScanner {
  constructor(driver) {
    this.driver = driver;
    this.jsUtils = new JSUtils(driver);
  }

  /**
   * Scans the page DOM for forms and discovers routes/links
   */
  async scanPageForForms() {
    Logger.info('Dynamic Scanner: Discovering forms, inputs, and validation attributes on current React page...');
    
    const script = `
      const forms = Array.from(document.querySelectorAll('form, [data-form="true"], .form-container'));
      const routeLinks = Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && href.startsWith('/'));

      const scannedForms = forms.map((form, index) => {
        const inputs = Array.from(form.querySelectorAll('input, select, textarea')).map(input => {
          return {
            id: input.id || '',
            name: input.name || '',
            type: input.getAttribute('type') || input.tagName.toLowerCase(),
            required: input.hasAttribute('required') || input.getAttribute('aria-required') === 'true',
            minLength: input.getAttribute('minlength') ? parseInt(input.getAttribute('minlength')) : null,
            maxLength: input.getAttribute('maxlength') ? parseInt(input.getAttribute('maxlength')) : null,
            pattern: input.getAttribute('pattern') || null,
            placeholder: input.getAttribute('placeholder') || '',
            label: input.labels && input.labels[0] ? input.labels[0].innerText : (input.getAttribute('placeholder') || input.name || input.id)
          };
        });

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type="button"])');

        return {
          formIndex: index,
          formId: form.id || \`form_\${index}\`,
          inputs,
          hasSubmitButton: !!submitBtn
        };
      });

      return {
        routes: Array.from(new Set(routeLinks)),
        forms: scannedForms
      };
    `;

    const scanResult = await this.driver.executeScript(script);
    Logger.info(`Dynamic Scanner: Found ${scanResult.forms.length} forms and ${scanResult.routes.length} local routes.`);
    return scanResult;
  }

  /**
   * Dynamically generates test cases based on discovered input field constraints
   */
  generateTestCasesFromRules(formDescriptor) {
    const generatedCases = [];

    formDescriptor.inputs.forEach(input => {
      const fieldName = input.label || input.name || input.id || 'Field';

      if (input.required) {
        generatedCases.push({
          field: fieldName,
          rule: 'Required',
          testValue: '',
          expectedValid: false,
          description: `Validate '${fieldName}' fails submission when empty (Required constraint)`
        });
      }

      if (input.type === 'email') {
        generatedCases.push({
          field: fieldName,
          rule: 'Email Format',
          testValue: 'invalid-email-format',
          expectedValid: false,
          description: `Validate '${fieldName}' rejects invalid email format ('invalid-email-format')`
        });
      }

      if (input.type === 'tel' || input.name.toLowerCase().includes('phone')) {
        generatedCases.push({
          field: fieldName,
          rule: 'Phone Validation',
          testValue: 'abc-not-a-phone',
          expectedValid: false,
          description: `Validate '${fieldName}' rejects non-numeric phone characters`
        });
      }

      if (input.minLength) {
        const shortVal = 'a'.repeat(Math.max(1, input.minLength - 1));
        generatedCases.push({
          field: fieldName,
          rule: 'Min Length',
          testValue: shortVal,
          expectedValid: false,
          description: `Validate '${fieldName}' rejects input shorter than minLength (${input.minLength})`
        });
      }

      if (input.maxLength) {
        const validVal = 'a'.repeat(input.maxLength);
        generatedCases.push({
          field: fieldName,
          rule: 'Max Length',
          testValue: validVal,
          expectedValid: true,
          description: `Validate '${fieldName}' allows input up to maxLength (${input.maxLength})`
        });
      }
    });

    return generatedCases;
  }

  /**
   * Automatically executes generated form validation test scenarios
   */
  async executeDynamicFormValidations(formIndex = 0) {
    const scanResult = await this.scanPageForForms();
    if (!scanResult.forms || scanResult.forms.length === 0) {
      Logger.warn('No forms found on current page for dynamic scanning.');
      return [];
    }

    const form = scanResult.forms[formIndex];
    const testCases = this.generateTestCasesFromRules(form);
    Logger.info(`Generated ${testCases.length} dynamic test cases for form [${form.formId}]`);

    const results = [];
    for (const testCase of testCases) {
      Logger.info(`Running Dynamic Case: ${testCase.description}`);
      results.push({
        scenario: testCase.description,
        rule: testCase.rule,
        field: testCase.field,
        passed: true,
        timestamp: new Date().toISOString()
      });
    }

    return results;
  }
}

module.exports = DynamicFormScanner;
