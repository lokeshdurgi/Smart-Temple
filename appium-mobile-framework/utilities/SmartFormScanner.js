const Logger = require('./Logger');

class SmartFormScanner {
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * Analyzes current mobile screen UI elements using page source XML inspection
   */
  async analyzeCurrentScreen() {
    Logger.info('Smart Mobile Scanner: Analyzing screen UI components & layout hierarchy...');
    
    let pageSource = '';
    try {
      pageSource = await this.driver.getPageSource();
    } catch (e) {
      Logger.error(`Failed to fetch page source: ${e.message}`);
    }

    const editTexts = await this.driver.$$('//android.widget.EditText');
    const buttons = await this.driver.$$('//android.widget.Button');
    const checkboxes = await this.driver.$$('//android.widget.CheckBox');
    const radioButtons = await this.driver.$$('//android.widget.RadioButton');
    const spinners = await this.driver.$$('//android.widget.Spinner');
    const recyclerViews = await this.driver.$$('//androidx.recyclerview.widget.RecyclerView');

    const discoveredInputs = [];
    for (let i = 0; i < editTexts.length; i++) {
      const elem = editTexts[i];
      const resId = await elem.getAttribute('resource-id').catch(() => '');
      const text = await elem.getAttribute('text').catch(() => '');
      const hint = await elem.getAttribute('content-desc').catch(() => '');
      
      discoveredInputs.push({
        index: i,
        resourceId: resId,
        text,
        hint: hint || text || `input_${i}`,
        inputType: resId.toLowerCase().includes('password') ? 'password' : 'text'
      });
    }

    Logger.info(`Discovered ${discoveredInputs.length} text inputs, ${buttons.length} buttons, ${checkboxes.length} checkboxes on active screen.`);

    return {
      inputs: discoveredInputs,
      buttonCount: buttons.length,
      checkboxCount: checkboxes.length,
      radioButtonCount: radioButtons.length,
      hasSpinner: spinners.length > 0,
      hasRecyclerView: recyclerViews.length > 0
    };
  }

  /**
   * Dynamically builds test scenarios based on Android UI component discovery
   */
  generateValidationScenarios(screenAnalysis) {
    const scenarios = [];

    screenAnalysis.inputs.forEach(input => {
      const name = input.hint || input.resourceId || `Field #${input.index}`;

      scenarios.push({
        scenarioName: `Smart Validation: Empty ${name}`,
        targetField: input,
        testValue: '',
        expectedBehavior: 'Trigger validation error toast/message'
      });

      if (input.inputType === 'password') {
        scenarios.push({
          scenarioName: `Smart Validation: Weak Password in ${name}`,
          targetField: input,
          testValue: '123',
          expectedBehavior: 'Reject password shorter than minimum complexity'
        });
      }
    });

    return scenarios;
  }
}

module.exports = SmartFormScanner;
