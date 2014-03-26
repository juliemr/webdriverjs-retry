webdriverjs-retry
=================

Retry library for webdriverJS tests.

BETA BETA BETA BETA

Usage
-----

Install with `npm install webdriverjs-retry`

Interface
---------
```javascript
var retry = require('webdriverjs-retry');

/**
 * @param {function} fn The function to execute. The entire contents of the
 *     function will be retried.
 * @param {number=} opt_timeout The total time to wait for this test to pass. If the
 *     timeout is exceeded and the code is erroring, throw that error.
 * @param {number=} opt_sleep Time to sleep between retries. Defaults to 100ms.
 * @return {webdriver.promise.Promise} a promise which will resolve when
 *     the retry is complete, or reject if the retry times out or encounters
 *     an error which is not ignored.
 */
retry.run(fn, opt_timeout, opt_sleep)

/**
 * Set the default timeout for this retrier.
 * @param {numer} timeout
 */
retry.setDefaultTimeout(timeout)

/**
 * Set the default sleep for this retrier.
 * @param {numer} sleep
 */
retry.setDefaultSleep(sleep)

/**
 * Set the errors to be ignored. By default, all errors are ignored.
 * The arguments may be either error classes or numbers, which correspond
 * to error codes.
 *
 * For a list of webdriver error codes, see
 * https://code.google.com/p/selenium/source/browse/javascript/atoms/error.js
 *
 * @param {...(number|Object)} varArgs a list of error codes or error
 *     classes to be ignored
 */
retry.ignoring(ErrorTypeA, ErrorTypeB, ...)
```

In your test
------------

```javascript
var retry = require('webdriverjs-retry');

var driver = ... // set up your webdriver

driver.get('localhost:8888');

// Do some stuff with your driver.

retry.run(function() {
  // Note that everything in here will be retried - including the
  // first click.
  driver.findElement(webdriver.By.id('showmessage')).click();

  // Even if it takes a while to show the message, this will pass.
  driver.findElement(webdriver.By.id('message')).click();
}, 5000);

// continue with your test

```

See a [full example](https://github.com/juliemr/webdriverjs-retry/blob/master/example_test.js).
