const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('examples normalization', function() {
    this.timeout(10000);
    var obj;
    var body;
    var type;
    before(() => {
      return parser('test/examples.raml')
      .then(result => raml2obj.parse({
        json: result
      }))
      .then((result) => {
        obj = result.json;
        body = obj.resources[0].methods[0].body[0];
        type = obj.types.Foo;
      });
    });

    it('Should replace example with examples for property', () => {
      assert.ok(body.properties[1].examples);
    });

    it('Transformed example of a property is an array', () => {
      assert.typeOf(body.properties[1].examples, 'array');
    });

    it('Should keep existing examples of a property', () => {
      assert.ok(body.properties[0].examples, 'Examples are set');
      assert.lengthOf(body.properties[0].examples, 2, 'Has two examples');
    });

    it('Should replace example with examples for body', () => {
      assert.typeOf(body.examples, 'array');
    });

    it('Body example should have 2 items', () => {
      assert.lengthOf(body.examples, 2);
    });

    it('Should keep consistent type examples', () => {
      assert.ok(type.examples, 'Examples are set');
      assert.lengthOf(type.examples, 1, 'Has one example');
    });
  });
});
