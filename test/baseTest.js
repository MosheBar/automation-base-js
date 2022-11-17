const LushaSalePage = require('../pages/lusha_main/lusha_sale');

describe('Lusha Base Tests', function () {
  it('Test: Test sale page', async function () {
    const salePage = new LushaSalePage(driver);

    await salePage.navigate();
    await salePage.validatePage();

  });

});
