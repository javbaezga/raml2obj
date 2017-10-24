const raml2obj = require('..');
const parser = require('./parser');

parser('test/inheritance.raml')
.then(result => raml2obj.parse(result))
.then((result) => {
  console.log(result);
});
