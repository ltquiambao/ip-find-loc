class IpFindApiRequest {
  constructor() {
    this.api = "https://ipfind.co";
    this.apiKey = process.env.IPFIND_API_KEY || "";
    this.url = this.api;
    this.queries = [];
  }

  validateIp(ip) {}

  addQuery(query) {
    this.queries.push(query);
  }

  setOwnIp() {
    this.url += "/me";
    return this;
  }

  setIp(ipToFetch) {
    if (ipToFetch) {
      this.addQuery({ ip: ipToFetch });
    }
    return this;
  }

  setApiKey() {
    this.addQuery({ auth: this.apiKey });
    return this;
  }

  build() {
    if (this.queries.length) {
      this.url += "?";
    }
    return this.queries.reduce(
      (acc, cur) =>
        acc + Object.entries(cur).map((a) => `${a[0]}=${a[1]}`) + "&",
      this.url
    );
  }
}

module.exports = IpFindApiRequest;
