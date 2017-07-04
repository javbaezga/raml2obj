const raml = require('raml-1-parser');

module.exports = function(source) {
  return raml
  .loadApi(source, {
    rejectOnErrors: false
  })
  .then(result => result.expand(true).toJSON({serializeMetadata: false}));
};
