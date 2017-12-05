[![Build Status](https://travis-ci.org/advanced-rest-client/raml2obj.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml2obj)

# RAML to object (ARC version)

This is a fork of [raml2obj](https://github.com/raml2html/raml2obj) library that
has been altered to serve Mulesoft's API console and Advanced REST Client
components.

There's a lot of differences between the libraries in the API.

* No RAML parser, this library expects a YAML input as a string
* this library have different approach to applying types definitions to properties / items. It doesn't override some fields if the property if they were defined inline.
* It's build for browser. Expansion library is an optional dependency for node. In browser environment you have to include build of the expansion library by your own.
* exposes more functions than the original library

This library is used by

- [raml-json-enhance](https://github.com/advanced-rest-client/raml-json-enhance)
- [raml-json-enhance-node](https://github.com/mulesoft-labs/raml-json-enhance-node)

## Install

```
$ npm i advanced-rest-client/raml2obj --save
```

## Usage (node)

```js
const parser = require('raml-1-parser');
const raml2obj = require('raml2obj');

parser.loadApi('./api.raml', {
  rejectOnErrors: false
})
.then(result => {
  return result.expand(true)
    .toJSON({
      serializeMetadata: false
    });
})
.then(json => raml2obj.parse({
  json: json,
  takeMeasurements: true
}))
.then(result => {
  console.log(result.json);
  console.table(result.measurement);
});
```

## Building browser version

Don't forget to pass `--ignore datatype-expansion` to [browserify](http://browserify.org/)
command to not include the node version of the expansion library.
In browser include browser version of the datatype-expansion library or
concatenate browser build with this output.

### Example build

```
$ browserify browser.js -o build/browserified.js --ignore datatype-expansion && babel build/browserified.js > build/babeled.js && uglifyjs --screw-ie8 build/babeled.js > build/raml2object.js
```

The `build/raml2object.js` is the one you'd like to include in the browser.
You can also concatenate it with [expansion library build](https://github.com/advanced-rest-client/raml-json-enhance/blob/stage/browser/index.js)
(259 KB) or other library that creates a canonical version of a type.


## License
[raml2obj](https://github.com/raml2html/raml2obj) is available under the MIT license. See the LICENSE file for more info.

ARC components are distributed under Apache 2 (open source or non-profit) or CC-BY license (others).
