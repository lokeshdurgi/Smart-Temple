const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../utilities/Logger');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.navLinks = By.css('.nav-link, nav a');
    this.sidebarLinks = By.css('.sidebar-link, .sidebar a');
    this.searchInput = By.css('input[type="search"], .search-bar input');
    this.tableRows = By.css('table tbody tr');
    this.paginationNext = By.css('.pagination .next, [data-testid="pagination-next"]');
    this.paginationPrev = By.css('.pagination .prev, [data-testid="pagination-prev"]');
    this.toastNotification = By.css('.toast, .notification-banner');
    this.loaderSpinner = By.css('.spinner, .loading-indicator');
    this.modalContainer = By.css('.modal, [role="dialog"]');
    this.modalCloseBtn = By.css('.modal .close, [data-testid="modal-close"]');
    this.tooltipElement = By.css('.tooltip, [data-tooltip]');
  }

  async search(query) {
    Logger.info(`Searching dashboard table for: '${query}'`);
    await this.type(this.searchInput, query);
  }

  async getTableRowCount() {
    const rows = await this.findElements(this.tableRows);
    return rows.length;
  }

  async goToNextPage() {
    await this.click(this.paginationNext);
  }

  async isToastVisible() {
    return await this.isDisplayed(this.toastNotification);
  }

  async isModalVisible() {
    return await this.isDisplayed(this.modalContainer);
  }

  async closeModal() {
    await this.click(this.modalCloseBtn);
  }

  async getTooltipText() {
    return await this.getText(this.tooltipElement);
  }
}

module.exports = DashboardPage;
