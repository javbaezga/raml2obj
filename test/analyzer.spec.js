const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('Analyzer', function() {
    this.timeout(10000);
    var obj;
    before(() => {
      return parser('test/examples.raml')
      .then(result => raml2obj.prepareObject(result, {
        analyze: true
      }))
      .then((result) => {
        obj = result;
      });
    });

    it('Contains json property', () => {
      assert.ok(obj.json);
    });

    it('Contains analyzer property', () => {
      assert.ok(obj.analyzer);

    });

    it('Analyzer is an array', () => {
      assert.typeOf(obj.analyzer, 'array');
    });

    it('Analyzer is empty', () => {
      // In node environment there's no performance API.
      assert.lengthOf(obj.analyzer, 0);
    });
  });
});
