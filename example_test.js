var util = require('util'),
    webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    retry = require('./index.js');

var driver = chrome.createDriver(
    new webdriver.Capabilities({'browserName': 'chrome'}),
    new chrome.ServiceBuilder('./chromedriver').build());

driver.get('localhost:8888');

retry.run(function() {
  // Note that everything in here will be retried - including the
  // first click.
  driver.findElement(webdriver.By.id('showmessage')).click();
  // This would throw an error without waiting because the message
  // is hidden for 3 seconds.
  driver.findElement(webdriver.By.id('message')).click();
}, 5000).then(function() {
  // run returns a promise which resolves when all the retrying is done
  // If the retry fails (either it times out or the error is not in the ignore
  // list) the promise will be rejected.
});

// 7 is the error code for element not found.
retry.ignoring(7).run(function() {
  driver.findElement(webdriver.By.id('creatediv')).click();
  // This would throw an error because the div does not appear for
  // 3 seconds.
  driver.findElement(webdriver.By.id('inserted')).getText();
}, 5000);

driver.quit();
