class ParseQueryError extends Error {
  constructor() {
    super("Please follow format: 'domain.tld' or 'domain'");
    this.code = "DOMAIN_CHECKER_PARSE_QUERY_ERROR"
    this.name = "DomainCheckerParseQueryError"

    // remove the default stack trace
    this.stack =
      this.stack.split('\n').splice(0, 1).join('\n') +
      "\n" +
      this.stack.split('\n').slice(3).join('\n');
  }
}

module.exports = { ParseQueryError }