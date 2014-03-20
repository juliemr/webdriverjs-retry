webdriverjs-retry
=================

Retry library for webdriverJS tests.

BETA BETA BETA BETA

Usage
-----

Install with `npm install webdriverjs-retry`

Interface
```javascript
/**
 * @param fn The function to execute. The entire contents of the function
 *     will be retried.
 * @param timeout The total time to wait for this test to pass. If the timeout
 *     is exceeded and the code is erroring, throw that error.
 * @param opt_sleep Time to sleep between retries. Defaults to 100ms.
 */
retry(fn, timeout, opt_sleep)
```

In your test

```javascript
var retry = require('webdriverjs-retry');

var driver = ... // set up your webdriver

driver.get('localhost:8888');

// Do some stuff with your driver.

retry(function() {
  // Note that everything in here will be retried - including the
  // first click.
  driver.findElement(webdriver.By.id('showmessage')).click();

  // Even if it takes a while to show the message, this will pass.
  driver.findElement(webdriver.By.id('message')).click();
}, 5000);

// continue with your test

```
