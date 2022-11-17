const { By } = require('selenium-webdriver');

const WebElementType = {
  Element: 0,
  Text: 1,
  Link: 2,
  TextBox: 3,
  Button: 4,
  CheckBox: 5,
  SelectBox: 6,
  Frame: 7,
};

class ElementSelector {

  constructor(by = undefined, elementType = undefined, webElement = WebElementType.Element, text = undefined) {
    this._by = by;
    this._elementType = elementType;
    this._webElementType = webElement;
    this._text = text;
  }

  setBy(by) {
    this._by = by;

    return this;
  }

  getText() {
    return this._text;
  }

  getByText() {
    return this._by;
  }

  getBy() {
    switch (this._elementType.toLowerCase()) {
      case 'id':
        return By.id(this._by);
      case 'css':
        return By.css(this._by);
      case 'xpath':
        return By.xpath(this._by);
      case 'name':
        return By.name(this._by);
      case 'className':
        return By.className(this._by);
      case 'tagName':
        return By.tagName(this._by);
      case 'linkText':
        return By.linkText(this._by);
      case 'partialLinkText':
        return By.partialLinkText(this._by);
      default:
        console.log('element Type is not defined');
    }

    return null;
  }

  setType(elementType) {
    this._elementType = elementType;

    return this;
  }

  setWebType(webElementType) {
    this._webElementType = webElementType;

    return this;
  }

  getWebType() {
    return this._webElementType;
  }

  setText(text) {
    this._text = text;

    return this;
  }

}


module.exports = { WebElementType, ElementSelector, };
