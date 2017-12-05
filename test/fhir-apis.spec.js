const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');
var performance;
try {
  performance = require('perf_hooks').performance;
} catch (e) {
  return;
}

describe('raml2obj', () => {
  describe('RAML example API (ARC)', function() {
    this.timeout(100000);
    var obj;

    before(() => {
      performance.mark('Start');
      return parser('test/fhir-apis/healthcare-system-api.raml')
      .then(result => {
        performance.mark('Parser end');
        performance.mark('Expand');
        return raml2obj.parse({
          json: result
        });
      })
      .then(result => {
        performance.mark('Expand end');
        obj = result.json;

        performance.measure('Parsing time', 'Start', 'Parser end');
        performance.measure('Expanding time', 'Expand', 'Expand end');
        performance.measure('Overall time', 'Start', 'Expand end');
      });
    });

    it('Should be parsed', function() {
      assert.typeOf(obj, 'object');
    });

    it('Should parse it in time', function() {
      const measure = performance.getEntriesByName('Parsing time')[0];
      assert.isBelow(measure.duration, 15000);
    });

    it('Should expand it in time', function() {
      const measure = performance.getEntriesByName('Expanding time')[0];
      assert.isBelow(measure.duration, 25000);
    });

    it('Should finish in time', function() {
      const measure = performance.getEntriesByName('Overall time')[0];
      assert.isBelow(measure.duration, 35000);
    });
  });
});
