const raml2obj = require('./');
/* global self */
if (typeof window === 'undefined') {
  // Web worker environment.
  self.raml2obj = raml2obj;
} else {
  window.raml2obj = raml2obj;
}
