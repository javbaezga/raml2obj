const raml2obj = require('..');
const parser = require('./parser');
// const {arraysToObjects} = require('../lib/arrays-objects');

parser('test/examples.raml')
.then(result => {
  // result = arraysToObjects(result);
  debugger;
  return raml2obj.parse(result);
  // return raml2obj.expandTypes(result.types);
})
.then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
