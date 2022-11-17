const BaseDriver = require('../baseDriver');
const wd = require('selenium-webdriver');
const BasePage = require('../../pages/basePage');

exports.mochaHooks = {
  beforeEach: async function () {
    global.driver = await new BaseDriver().initWebDriver();
  },

  afterEach: async function () {
    if(!this.currentTest.isPassed()) {
      await new BasePage(driver).takeScreenshot('Test_Failure_Pic');
      console.log('!!! Test Failed  😥  😭  🤦');
      await driver.manage().logs().get(wd.logging.Type.BROWSER)
        .then(async function(entries) {
          entries.forEach(function(entry) {
            if (entry.level.name != 'WARNING')
              console.log('[%s] %s', entry.level.name, entry.message);
          });
        });
      }

    await driver.quit();
  },

};
