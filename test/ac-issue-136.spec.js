/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('ac-issue-136.raml', () => {
    let obj;

    before(() => {
      return parser('test/ac-issue-136.raml')
      .then(result => raml2obj.parse(result))
      .then((result) => {
        obj = result;
      });
    });

    it('baseUriParameters should be as defined in RAML', () => {
      const param = obj.baseUriParameters[1];
      assert.equal(param.enum[0], 'v1');
    });

    it('/resource should have original enum value', () => {
      const param = obj.resources[0].allUriParameters[1];
      assert.equal(param.enum[0], 'v1');
    });

    it('GET /resource should have original enum value', () => {
      const param = obj.resources[0].methods[0].allUriParameters[1];
      assert.equal(param.enum[0], 'v1');
    });

    it('/aggregate/contents should have new enum value', () => {
      const param = obj.resources[1].allUriParameters[1];
      assert.equal(param.enum[0], 'v2');
    });

    it('GET /aggregate/contents should have new enum value', () => {
      const param = obj.resources[1].methods[0].allUriParameters[1];
      assert.equal(param.enum[0], 'v2');
    });
  });
});
