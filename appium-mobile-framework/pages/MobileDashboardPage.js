const MobileBasePage = require('./MobileBasePage');
const Logger = require('../utilities/Logger');

class MobileDashboardPage extends MobileBasePage {
  constructor(driver) {
    super(driver);
    this.sideDrawerBtn = '~Open navigation drawer';
    this.bottomNavHome = 'id=com.example.app:id/nav_home';
    this.bottomNavProfile = 'id=com.example.app:id/nav_profile';
    this.recyclerView = 'id=com.example.app:id/recycler_view';
    this.cardItems = '//androidx.cardview.widget.CardView';
    this.dialogTitle = 'id=com.example.app:id/dialog_title';
    this.dialogConfirmBtn = 'id=android:id/button1';
    this.snackbarText = 'id=com.google.android.material:id/snackbar_text';
    this.progressBar = 'id=com.example.app:id/progress_bar';
  }

  async openSideDrawer() {
    Logger.info('Opening side navigation drawer');
    await this.click(this.sideDrawerBtn);
  }

  async navigateToProfileTab() {
    Logger.info('Navigating to profile tab via bottom navigation');
    await this.click(this.bottomNavProfile);
  }

  async scrollRecyclerViewToItem(targetText) {
    Logger.info(`Scrolling RecyclerView to find item: '${targetText}'`);
    const locator = `//*[@text="${targetText}"]`;
    return await this.gestures.scrollUntilVisible(locator);
  }

  async isDialogVisible() {
    return await this.isDisplayed(this.dialogTitle);
  }

  async confirmDialog() {
    await this.click(this.dialogConfirmBtn);
  }

  async getSnackbarMessage() {
    if (await this.isDisplayed(this.snackbarText)) {
      return await this.getText(this.snackbarText);
    }
    return '';
  }
}

module.exports = MobileDashboardPage;
