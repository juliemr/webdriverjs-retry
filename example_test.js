var util = require('util'),
    webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    retry = require('./index.js');

var service = new chrome.ServiceBuilder('./chromedriver').build();
var driver = chrome.createDriver(
        new webdriver.Capabilities({'browserName': 'chrome'}), service);

driver.get('localhost:8888');

retry(function() {
  driver.findElement(webdriver.By.id('showmessage')).click();
  // This would throw an error without waiting because the message
  // is hidden for 3 seconds.
  driver.findElement(webdriver.By.id('message')).click();
});

driver.quit();
