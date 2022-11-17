const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const RESOLUTION = { default: '--window-size=1920,1080' };
const chromedriverPath = require('chromedriver').path;

module.exports = class BaseDriver {

  constructor() {
    this.driver = undefined;
  }

  initWebDriver(params = {}) {
    const { Options: ChromeOptions } = chrome;
    const options = new ChromeOptions();
    const args = ['user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'];

    args.push(RESOLUTION.default);
    args.push('disable-infobars');
    args.push('--no-sandbox');
    args.push('--disable-dev-shm-usage');
    args.push('--disable-gpu');
    args.push('--enable-automation');
    args.push('--disable-browser-side-navigation');
    args.push('--lang=en-us)');

    options.addArguments(args);

    return new Builder().setChromeOptions(options).forBrowser('chrome').build();
  }

};
