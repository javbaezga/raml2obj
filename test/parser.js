const raml = require('raml-1-parser');

module.exports = function(source) {
  return raml
  .loadApi(source, {
    rejectOnErrors: false
  })
  .then(result => {
    return result.expand(true).toJSON({serializeMetadata: false});
  });
};
