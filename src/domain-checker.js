const parseQuery = require('./lib/parseQuery')

module.exports.installVendors = (vendors = {}) => {
    // install vendors connectors
    const installed = {}
    for (let key in vendors) installed[key] = vendors[key]

    // return search function
    return async (query, vendors = []) => {

        // select vendor connectors to use
        if (!Array.isArray(vendors)) vendors = [vendors]
        vendors = vendors.filter(v => typeof v === 'string')
        if (vendors.length === 0) vendors = Object.keys(installed)

        // parse query
        const { domain, tld } = parseQuery(query)
        const res = {}
        for (let vendor of vendors) {
            console.log(`Searching ${vendor} for ${domain}.${tld}...`)
            res[vendor] = await installed[vendor](domain, tld)
                .then(e => e)
                .catch(() => [])
        }
        return res
    }
}