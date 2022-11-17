const chai = require('chai');

class Validate {

  async equal(actual, expected, free_text='') {
    await allure.createStep('validate equal', async () => {
      await chai.assert.equal(actual, expected, `failed to compare equal ${free_text}`);
    })();
  }

  async not_equal(actual, expected, free_text='') {
    await allure.createStep('validate not equal', async () => {
      await chai.assert.notEqual(actual, expected, `failed to compare not equal ${free_text}`);
    })();
  }

  async contain(container, toContain, free_text='') {
    await allure.createStep('validate contain', async () => {
      await chai.assert.include(container, toContain, `failed to validate contain ${free_text}`);
    })();
  }

  async not_contain(container, toNotContain, free_text='') {
    await allure.createStep('validate not contain', async () => {
      await chai.assert.notInclude(container, toNotContain, `failed to validate not contain ${free_text}`);
    })();
  }

  async isTrue(value, free_text='') {
    await allure.createStep('validate is true', async () => {
      await chai.assert.isTrue(value, `failed to compare is True ${free_text}`);
    })();
  }

}

const validate = new Validate();

module.exports = { validate };
