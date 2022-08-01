import parseQuery from './lib/parseQuery.js'
import freenom from './vendor/freenom.js'
import namesilo from './vendor/namesilo.js'
import google from './vendor/google.js'

export const methods = {
  freenom,
  namesilo, 
  google
}

export const vendors = Object.keys(methods)

export const domainChecker = (query) => {
  const { domain, tld } = parseQuery(query);
  const res = {}
  for (let vendor of vendors) {
    res[ vendor ] = async (opts) => await methods[ vendor ]({domain, tld, ...opts})
  }
  return res
}

export default domainChecker