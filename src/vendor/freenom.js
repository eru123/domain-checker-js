const parseQuery = require('../lib/parseQuery')
const https = require('follow-redirects').https;

const scrape = (tlds) => {
  const result = []
  for (let tld of tlds) {
    result.push({
      available: !(tld.status == "NOT AVAILABLE" || tld.status === null) ? true : false,
      sld: tld.domain,
      tld: tld.tld,
      currency: tld.currency,
      price: Number(tld.price_int + "." + tld.price_cent) || 0,
    })
  }
  return result
}

const search = async (query) => new Promise((resolve, reject) => {
  const { tld, domain } = parseQuery(query)
  const options = {
    'method': 'POST',
    'hostname': 'my.freenom.com',
    'path': '/includes/domains/fn-available.php',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    'maxRedirects': 20
  };

  const req = https.request(options, (res) => {
    const chunks = [];
    res.on("data", (chunk) => chunks.push(chunk))
    res.on("end", () => {
      let data = JSON.parse(Buffer.concat(chunks).toString())
      let tlds = []; if (data?.top_domain && !data?.top_domain.dont_show) tlds.push(data.top_domain);
      let result = scrape([...tlds, ...data?.free_domains, ...data?.paid_domains])
      resolve(result)
    })
    res.on("error", (err) => reject(err));
  })

  const postData = new URLSearchParams()
  postData.append('domain', domain)
  postData.append('tld', tld)
  req.write(postData.toString());
  req.end();
})

module.exports = async (query) => {
  const res = await search(query)
  return res
}