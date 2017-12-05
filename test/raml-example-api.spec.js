const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('RAML example API (ARC)', function() {
    this.timeout(10000);
    var obj;
    before(() => {
      return parser('test/raml-example-api-master/api.raml')
      .then(result => raml2obj.parse({
        json: result
      }))
      .then((result) => {
        obj = result.json;
      });
    });

    describe('Traits', function() {
      it('Generates traits', () => {
        const traits = obj.traits;
        assert.typeOf(traits.Paginated, 'object');
        assert.typeOf(traits.Adminable, 'object');
      });

      it('Trait types are expanded', () => {
        const trait = obj.traits.Paginated;
        assert.typeOf(trait.queryParameters, 'array');
        assert.lengthOf(trait.queryParameters, 3);
      });

      it('Trait examples are computed', () => {
        const params = obj.traits.Paginated.queryParameters;
        assert.typeOf(params[0].examples, 'array');
        assert.lengthOf(params[0].examples, 1);
        assert.typeOf(params[1].examples, 'array');
        assert.lengthOf(params[1].examples, 1);
        assert.typeOf(params[2].examples, 'array');
        assert.lengthOf(params[2].examples, 1);
      });

      it('Trait responses are computed', () => {
        const resp = obj.traits.Paginated.responses;
        assert.typeOf(resp, 'array');
        assert.lengthOf(resp, 2);
      });

      it('Trait response body is required', () => {
        const resp = obj.traits.Paginated.responses[0].body[0];
        assert.isTrue(resp.required);
      });

      it('Trait response body has properties', () => {
        const body1 = obj.traits.Paginated.responses[0].body[0];
        assert.typeOf(body1.properties, 'array');
        assert.lengthOf(body1.properties, 2);
        assert.isTrue(body1.properties[0].required);
        const body2 = obj.traits.Paginated.responses[0].body[0];
        assert.typeOf(body2.properties, 'array');
        assert.lengthOf(body2.properties, 2);
      });

      it('Trait has description', () => {
        const trait = obj.traits.Paginated;
        assert.typeOf(trait.description, 'string');
        assert.typeOf(trait.name, 'string');
        assert.typeOf(trait.usage, 'string');
      });
    });

    describe('Resource types', function() {
      it('Generates resource types', () => {
        const types = obj.resourceTypes;
        assert.typeOf(types, 'object');
        assert.lengthOf(Object.keys(types), 4);
      });

      it('Has securedBy', () => {
        const type = obj.resourceTypes.ErrorredResource;
        assert.typeOf(type.securedBy, 'array');
        assert.lengthOf(type.securedBy, 7);
        assert.typeOf(type.securedBy[0], 'string');
      });

      it('Has name', () => {
        const type = obj.resourceTypes.ErrorredResource;
        assert.equal(type.name, 'ErrorredResource');
      });

      it('Has methods definition', () => {
        assert.typeOf(obj.resourceTypes.ErrorredResource.get, 'object');
        assert.typeOf(obj.resourceTypes.ResourceNotFound.get, 'object');
        assert.typeOf(obj.resourceTypes.UnauthorizedResponse.get, 'object');
        assert.typeOf(obj.resourceTypes.RequestErrorResponse.get, 'object');
      });

      it('Method response body properties are computed', () => {
        const body = obj.resourceTypes.UnauthorizedResponse.get.responses[0].body;
        assert.typeOf(body, 'array');
        assert.lengthOf(body, 2);

        const props = body[0].properties;
        assert.typeOf(props, 'array');
        assert.lengthOf(props, 2);
      });
    });

    describe('Annotation types', function() {
      it('Generates annotation types', () => {
        const types = obj.annotationTypes;
        assert.typeOf(types, 'object');
        assert.lengthOf(Object.keys(types), 3);
      });

      it('Type has properties', () => {
        const type = obj.annotationTypes.clearanceLevel;
        assert.isTrue(type.required);
        assert.typeOf(type.properties, 'array');
        assert.lengthOf(type.properties, 2);
      });
    });

    describe('Security schemes', function() {
      it('Generates security schemes', () => {
        const types = obj.securitySchemes;
        assert.typeOf(types, 'object');
        assert.lengthOf(Object.keys(types), 7);
      });
    });

    describe('Base URI parameters', function() {
      it('Generates baseUriParameters', () => {
        const types = obj.baseUriParameters;
        assert.typeOf(types, 'array');
        assert.lengthOf(types, 2);
      });

      it('Examples are computed', () => {
        const type = obj.baseUriParameters[0];
        assert.isUndefined(type.example);
        assert.typeOf(type.examples, 'array');
        assert.lengthOf(type.examples, 1);
      });

      it('Type is required', () => {
        assert.isTrue(obj.baseUriParameters[0].required);
        assert.isTrue(obj.baseUriParameters[1].required);
      });
    });

    describe('Protocols', function() {
      it('Protocols property is computed', () => {
        assert.typeOf(obj.protocols, 'array');
        assert.lengthOf(obj.protocols, 1);
        assert.equal(obj.protocols[0], 'HTTP');
      });
    });

    describe('Media Type', function() {
      it('mediaType property is computed', () => {
        assert.typeOf(obj.mediaType, 'array');
        assert.lengthOf(obj.mediaType, 2);
        assert.equal(obj.mediaType[0], 'application/json');
        assert.equal(obj.mediaType[1], 'application/xml');
      });
    });

    describe('Secured By', function() {
      it('securedBy property is computed', () => {
        assert.typeOf(obj.securedBy, 'array');
        assert.lengthOf(obj.securedBy, 7);
      });
    });

    describe('Documentation', function() {
      it('documentation property is computed', () => {
        assert.typeOf(obj.documentation, 'array');
        assert.lengthOf(obj.documentation, 3);
      });

      it('documentation contains required properties', () => {
        const doc = obj.documentation[0];
        assert.equal(doc.title, 'Read this!');
        assert.typeOf(doc.content, 'string');
      });
    });

    describe('Types', function() {
      it('types property is computed', () => {
        assert.typeOf(obj.types, 'object');
        assert.lengthOf(Object.keys(obj.types), 15);
      });

      it('Type is expanded', () => {
        const type = obj.types.AppPerson;
        assert.typeOf(type.properties, 'array');
        assert.lengthOf(type.properties, 9);

        const inner = type.properties[6].properties;
        assert.typeOf(inner, 'array');
        assert.lengthOf(inner, 2);

        const manager = obj.types['ExampleType.Manager'];
        assert.typeOf(manager.properties, 'array');
        assert.lengthOf(manager.properties, 6);

        const union = obj.types['ExampleType.AlterablePerson'];
        assert.typeOf(union.anyOf, 'array');
        assert.lengthOf(union.anyOf, 2);
      });
    });

    it('properties types are normalized', () => {
      const union = obj.types['ExampleType.AlterablePerson'];
      assert.equal(union.anyOf[0].type, 'object');

      const props = union.anyOf[0].properties;
      assert.equal(props[0].type, 'string');
    });
  });
});
