const parseQuery = require('../lib/parseQuery')
const https = require('follow-redirects').https;

const scrape = (items) => {
  const result = []
  for (let item of items) {
    result.push({
      available: item?.supportedResultInfo?.availabilityInfo?.availability == "AVAILABILITY_AVAILABLE",
      sld: item?.domainName?.sld,
      tld: "." + item?.domainName?.tld,
      currency: (
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.registerPrice?.currencyCode ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.renewPrice?.currencyCode ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.transferPrice?.currencyCode
      ) || (
          item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.registerPrice?.currencyCode ||
          item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.renewPrice?.currencyCode ||
          item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.transferPrice?.currencyCode
        ) || "USD",
      price: (
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.registerPrice?.units ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.renewPrice?.units ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.transferPrice?.units
      ) || (
          item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.registerPrice?.units ||
          item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.renewPrice?.units ||
          item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.transferPrice?.units
        ) || 0
    })
  }
  return result
}

const request = (query) => {
  return new Promise((resolve, reject) => {
    const { domain, tld } = parseQuery(query)

    let options = {
      'method': 'POST',
      'hostname': 'domains.google.com',
      'path': '/v1/Main/FeSearchService/Search',
      'headers': { 'Content-Type': 'application/json' },
      'maxRedirects': 20
    };

    let req = https.request(options, (res) => {
      let chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks).toString()));
      res.on("error", (err) => reject(err));
    });

    let postData = JSON.stringify({
      "clientFilters": {},
      "clientUserSpec": {
        "countryCode": "PH",
        "currencyCode": "USD"
      },
      "debugType": "DEBUG_TYPE_NONE",
      "query": tld ? `${domain}.${tld}` : domain
    });

    req.write(postData);
    req.setTimeout(1000, () => req.end());
    req.end();
  })
}

module.exports = async (query) => {
  const response = await request(query)
  const re = /^\)]}'/;
  const json = response.replace(re, '').trim()
  const items = JSON.parse(json)
  return scrape(items?.searchResponse?.results?.result)
}