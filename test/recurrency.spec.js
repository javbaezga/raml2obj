/* eslint-env node, mocha */

const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('recurrency', function() {
    this.timeout(10000);
    var obj;
    before(() => {
      return parser('test/raml-example-api-master/api.raml')
      .then(result => raml2obj.parse(result))
      .then((result) => {
        obj = result;
      });
    });

    it('should enhance recursive types', () => {
      assert.ok(obj);
    });
  });
});
