/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('jira issue fv-359', () => {
    let obj;

    before(() => {
      return parser('test/fv-359/dev.raml')
      .then(result => raml2obj.parse({
        json: result
      }))
      .then((result) => {
        obj = result.json;
      });
    });

    it('baseUri should be extended', () => {
      assert.equal(obj.baseUri, 'http://devx.example.com');
    });

    it('resource base uri should be extended', () => {
      assert.equal(obj.resources[0].absoluteUri, 'http://devx.example.com/resource');
    });

    it('method base uri should be extended', () => {
      assert.equal(obj.resources[0].methods[0].absoluteUri, 'http://devx.example.com/resource');
    });
  });
});
