const BasePage = require('../basePage');
const { ElementSelector, WebElementType } = require('../../core/vars_global');

module.exports = class LushaSalePage extends BasePage {

  constructor(driver) {
    super(driver);
    this.pageUrl = 'https://www.lusha.com';
    this.loginButton = new ElementSelector('[data-test-id=header-form-login-link-button]', 'css', WebElementType.Button, 'Login');
  }

  async navigate() {
    await allure.createStep('Navigate to Lusha Sale page', async () => {
      await super.navigate(this.pageUrl);
    })();
  }

  async validatePage() {
    await allure.createStep('Validate Lusha Sale page', async () => {
      await this.waitVisible(this.loginButton, 60000);
    })();
  }


};
