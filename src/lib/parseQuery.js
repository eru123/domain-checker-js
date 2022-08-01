const { ParseQueryError } = require('./Errors');

module.exports = (query) => {
  query = query.trim();
  const dots = query.match(/\./g)?.length || 0
  if (dots === 0) {
    if (query.match(/[a-zA-Z0-9]/)) {
      return {
        domain: query,
        tld: null
      }
    }
  } else if (dots === 1) {
    const [domain, tld] = query.split('.');
    if (domain.match(/[a-zA-Z0-9-_]/) && tld.match(/[a-zA-Z]/)) {
      return {
        domain,
        tld
      }
    }
  }
  throw new ParseQueryError();
}