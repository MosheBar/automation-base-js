// const { promisify } = require('util');
const { until, Key } = require('selenium-webdriver');
const { ElementSelector, WebElementType } = require('../core/vars_global');
const { validate } = require('../core/validate');
const DEFAULT_TIMEOUT = 30000;
const MIN_TIMEOUT = 900;
const DEFAULT_INTERVAL = 500;

// const allure = require('mocha-allure-reporter')
require('mocha-allure-reporter');

module.exports = class BasePage {

  constructor(driver) {
    this.driver = driver;
    this.validate = validate;
    this.pageUrl='';
  }

  async refreshPage() {
    await this.driver.navigate().refresh();
  }


  async waitVisible(selector, timeout = DEFAULT_TIMEOUT, index = 0) {
    let webElement = null;

    await allure.createStep(`wait for element to be visible: ${selector.getByText()}`, async () => {
      const existElement = await this.waitForElements(selector, timeout, index);

      webElement = await this.driver.wait(until.elementIsVisible(existElement), timeout);
    })();

    return webElement;
  }

  async waitNotVisible(selector, timeout = 5000, index = 0) {
    let webElement = null;

    await allure.createStep(`wait for element to be not visible: ${selector.getByText()}`, async () => {
      let existElement = null;

      try{
        existElement = await this.waitForElements(selector, timeout, undefined, index);

        if (existElement)
          webElement = await this.driver.wait(until.elementIsNotVisible(existElement), timeout);
      }catch(e){
        if (e.name === 'TimeoutError')
          throw e;

        console.log('element could not be found on the page');
      }
    })();

    return webElement;
  }

  async waitClickable(selector, timeout = DEFAULT_TIMEOUT, index = 0) {
    let webElement = null;

    const existElement = await this.waitForElements(selector, timeout, index);

    webElement = await this.driver.wait(until.elementIsEnabled(existElement), timeout);

    return webElement;
  }

  async waitForElement(selector, timeout = DEFAULT_TIMEOUT, index = 0){
    return this.waitForElements(selector, timeout, index);
  }

  async waitForElements(selector, timeout = DEFAULT_TIMEOUT, index = undefined) {
    let returnElements = [];
    await this.driver.switchTo().defaultContent();

    await this.driver.wait(until.elementLocated(await selector.getBy()), timeout);

    const elements = await this.driver.findElements(await selector.getBy());

    returnElements = index === undefined ? elements : elements[index];

    return returnElements;
  }

  async waitNotExist(selector, timeout = DEFAULT_TIMEOUT) {
    let existElement = null;
    let retry = timeout / DEFAULT_INTERVAL;

    try {
      existElement = await this.waitForElement(selector, MIN_TIMEOUT, 0, false);
    } catch (e) {
      console.log('failed to find the selector');
    }

    while (existElement !== undefined && retry) {
      await this.driver.sleep(DEFAULT_INTERVAL);
      retry--;
      existElement = await this.waitForElement(selector, DEFAULT_INTERVAL, 0, false);
    }

    if (existElement !== undefined)
      throw new Error('Failed to wait for element to disappear');
  }

  async isExist(selector, timeout = DEFAULT_TIMEOUT) {
    let existCheck = false;

    try {
      await this.waitForElement(selector, timeout);
      existCheck = true;
    } catch (e) {
      console.log(`element is not exist - ${await selector.getByText()}`);
    }

    return existCheck;
  }

  async validateExist(selector, expected = true, timeout = DEFAULT_TIMEOUT) {
    await allure.createStep(`validate Selector: ${selector.getByText()}, exist: ${expected}`, async () => {
      await this.validate.equal(await this.isExist(selector, timeout), (/true/i).test(expected));
    })();
  }

  async isVisible(selector, timeout = DEFAULT_TIMEOUT) {
    let visibleCheck = false;

    try {
      await this.waitVisible(selector, timeout);
      visibleCheck = true;
    } catch (e) {
      console.log(`element is no visible- ${await selector.getByText()}`);
    }

    return visibleCheck;
  }

  async validateVisible(selector, expected = true, timeout = DEFAULT_TIMEOUT) {
    await this.validate.equal(await this.isVisible(selector, timeout), (/true/i).test(expected), `selector: ${selector.getByText()}`);
  }

  async click(selector, index = 0, timeout = DEFAULT_TIMEOUT) {
    let existElement = null;

    await allure.createStep(`clicking on element: ${selector.getByText()}`, async () => {
      console.log(`clicking on element ${await selector.getByText()}`);

      existElement = await this.waitForElements(selector, timeout, index);

      await existElement.click();

      if (await selector.getFrame())
        await this.switchToDefault();
    })();

    return existElement;
  }

  async hover(selector, webElement=undefined) {
    let existElement = null;

    existElement = webElement? webElement:await this.waitForElement(selector);

    const actions = this.driver.actions({ bridge: true });

    console.log(`hovering the element ${webElement? 'webElement':await selector.getByText()}`);
    await actions.move({ duration:5000,origin:existElement,x:0,y:0 }).perform();

    return existElement;
  }

  async scrollToElement(selector) {
    let existElement = null;

    await allure.createStep(`scroll to the element ${await selector.getByText()}`, async () => {
      existElement = await this.waitForElement(selector);
      await this.driver.executeScript('arguments[0].scrollIntoView(true);', existElement);
    })();

    return existElement;
  }

  async getText(selector, getInnerText = false, index = 0) {
    let text = null;

    try {
      const existElement = await this.waitForElements(selector, undefined, index);

      text = getInnerText ? await existElement.getAttribute('innerText') : await existElement.getText();

      console.log(`getting element text ${await selector.getByText()} text: ${text}`);
    } catch (e) {
      console.log(`failed to get element text ${await selector.getByText()} the exception error: ${e}`);
    }

    return text;
  }

  async setText(selector, text, clear = true, clearValue = false) {
    let existElement = null;

    await allure.createStep(`set text: ${text} to element: ${selector.getByText()}`, async () => {
      if (text && text !== null) {
        existElement = await this.waitForElement(selector);

        if (clear) {
          await existElement.clear();

          if (clearValue)
            await this.clearValue(selector);
        }

        console.log('setting in selector' + selector.getByText() + ' text: ' + text);

        await existElement.sendKeys(text);
      }
    })();

    return existElement;
  }

  async getValue(selector) {
    return this.getAttribute(selector, 'value');
  }

  async getPlaceHolder(selector) {
    return this.getAttribute(selector, 'placeholder');
  }

  async getAttribute(selector, attr, timeout = undefined) {
    let text;

    try {
      const existElement = await this.waitForElement(selector, timeout);

      text = await existElement.getAttribute(attr);

      console.log(`getting element text ${await selector.getByText()} in attribute: ${attr} text: ${text}`);
    } catch (e) {
      console.log(`failed to get element text ${await selector.getByText()} in attribute: ${attr} the exception error: ${e}`);
    }

    return text;
  }

  async getCssValue(selector, cssVal, timeout = undefined) {
    let text;

    try {
      const existElement = await this.waitForElement(selector, timeout);

      text = await existElement.getCssValue(cssVal);

      console.log(`getting element text ${await selector.getByText()} in CSS Value: ${cssVal} text: ${text}`);
    } catch (e) {
      console.log(`failed to get element text ${await selector.getByText()} in CSS Value: ${cssVal} the exception error: ${e}`);
    }

    return text;
  }

  async getPageTitle() {
    return this.driver.getTitle();
  }

  async getURL() {
    return this.driver.getCurrentUrl();
  }

  async navigate(url) {
    await allure.createStep(`Navigate to URL: ${url}`, async () => {
      await this.driver.get(url);
    })();
  }

  async switchToTabName(tabName , contain = true) {
    await this.waitForNewWindow();

    for (const winHandle of (await this.driver.getAllWindowHandles())) {
      await this.driver.switchTo().window(winHandle);

      const myPageTitle = await this.driver.getTitle();

      if (contain && myPageTitle != null) {
        if (myPageTitle.includes(tabName))
          break;
      } else if (myPageTitle === tabName) {
        break;
      }
    }
  }

  async validateUrl(url, regex = undefined) {
    await allure.createStep(`Validating URL with: ${url}`, async () => {
      const pageUrl = await this.getURL();

      if (regex) {
        const test = regex.test(pageUrl);

        await this.validate.isTrue(test);
      } else {
        await this.validate.equal(pageUrl, url, `Failed to compare page with ${pageUrl}`);
      }
    })();
  }

  async validateText(selector, text = null, ignoreBreakLine = false, isEqual = true) {
    let elemText = await this.getText(selector);
    const myText = !text ? selector.getText() : text;

    await allure.createStep(`Validating text of element ${selector.getByText()}, with: '${myText}', and ignoreBreakLine: ${ignoreBreakLine}, isEqual: ${isEqual}`, async () => {
      if (ignoreBreakLine)
        elemText = elemText.replace(/\n/g, '');

      if (isEqual)
        await this.validate.equal(elemText, myText, `Failed to compare text expected text: ${myText} with element text: ${elemText}`);
      else
        await this.validate.contain(elemText, myText, `Failed to compare text contain expected text: ${myText} with element text: ${elemText}`);
    })();
  }

  async validateValue(selector, val = null, isEqual = true) {
    await allure.createStep(`Validating value of element ${selector.getByText()}, with: '${val}', and isEqual: ${isEqual}`, async () => {
      if (val !== null) {
        const elemValue = await this.getValue(selector);

        if(isEqual)
          await this.validate.equal(elemValue, val, `Failed to compare value expected text: ${val} with element value: ${elemValue}`);
        else
          await this.validate.contain(elemValue, val, `Failed to compare value contain expected text: ${val} with element value: ${elemValue}`);
      }
    })();
  }

  async validatePage() {
    throw new Error('Need to init validate page method');
  }

  async takeScreenshot(picName) {
    await allure.createStep(`taking picture name: ${picName}`, async () => {
      const image = await this.driver.takeScreenshot();

      try {
        await allure.createAttachment(picName, new Buffer(image, 'base64'));
      } catch (error) {
        console.log('WebDriver: Can\'t take screenshot on failure!');
      }
    })();
  }

};
