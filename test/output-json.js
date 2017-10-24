const fs = require('fs');
const raml2obj = require('..');
const glob = require('glob');
const parser = require('./parser');

process.chdir(__dirname);

const ramlFiles = glob.sync('*.raml');

const ps = ramlFiles.map((ramlFile) => {
  console.log(ramlFile);
  return parser(ramlFile)
  .then(result => {
    // if (ramlFile === 'worldmusic.raml') {
    //   debugger;
    // }
    return raml2obj.parse(result);
  })
  .then((result) => {
    console.log('Saving', ramlFile);
    const jsonString = JSON.stringify(result, null, 2);
    const filename = ramlFile.replace('.raml', '.json');
    fs.writeFileSync(filename, jsonString);
  })
  .catch(cause => {
    console.error('Error with file: ', ramlFile);
    console.error(cause);
  });
});
Promise.all(ps)
.then(() => console.log('done'))
.catch((cause) => console.error(cause));
