/* eslint-env node, mocha */

const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('xml', function() {
    this.timeout(10000);
    var obj;
    var resp200;
    var resp205;
    before(() => {
      return parser('test/xml.raml')
      .then(result => raml2obj.parse(result))
      .then((result) => {
        obj = result;
        resp200 = obj.resources[0].methods[0].responses[0].body[0];
        resp205 = obj.resources[0].methods[0].responses[1].body[0];
      });
    });

    it('Person should have 2 properties', () => {
      var type = obj.types.Person;
      assert.lengthOf(Object.keys(type.properties), 4);
    });

    it('Person2.addresses should be an array', () => {
      var type = obj.types.Person;
      assert.equal(type.properties[2].type, 'array');
    });

    it('Person2 should have 2 properties', () => {
      var type = obj.types.Person2;
      assert.lengthOf(type.properties, 2);
    });

    it('Person2.addresses should be an Address', () => {
      var type = obj.types.Person2;
      assert.equal(type.properties[1].type, 'array');
    });

    it('Company.representative should be type of object', () => {
      var type = obj.types.Company.properties[2];
      assert.equal(type.type, 'object');
    });

    it('Company.representative should have list of peoprties', () => {
      var type = obj.types.Company.properties[2];
      assert.typeOf(type.properties, 'array');
    });

    it('200 response should have 5 properties', () => {
      assert.lengthOf(resp200.properties, 5);
    });

    it('200 response should have 2 examples', () => {
      assert.lengthOf(resp200.examples, 2);
    });

    it('205 response should have 4 properties', () => {
      assert.lengthOf(resp205.properties, 4);
    });

    it('205 response should have 1 example', () => {
      assert.lengthOf(resp205.examples, 1);
    });

    it('Property has xml.attribute', () => {
      var type = obj.types.Person2.properties[0];
      assert.isTrue(type.xml.attribute);
    });

    it('Property has xml.name', () => {
      var type = obj.types.Person2.properties[0];
      assert.equal(type.xml.name, 'fullname');
    });

    it('Property has xml.wrapped', () => {
      var type = obj.types.Person2.properties[1];
      assert.isTrue(type.xml.wrapped);
    });
  });
});
