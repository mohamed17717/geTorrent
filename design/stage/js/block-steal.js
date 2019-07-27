const rules = {
  allowedHosts: ["127.0.0.1:*", "localhost:*", "getorrent*"],

  selectors: [
    // 'html body div#app.home header#search div.logo-container h1#logo',
    "html body header#search div.logo-container h1#logo"
  ],

  functions: [() => document.querySelector("#logo").innerText === "geTorrent"],

  block() {
    document.body.innerHTML = "";
  }
};

function blockStealSrc(rules) {
  let host = window.location.host;

  function checkHosts(host, allowedHosts) {
    for (let allowedHost of allowedHosts) {
      allowedHost = allowedHost.replace(/\./g, "\\.").replace(/\*/, ".*");
      let ptrn = new RegExp(allowedHost, "i");
      if (ptrn.test(host)) {
        return true;
      }
    }
    return false;
  }

  function checkSelectors(selectors) {
    let result = selectors.filter(selector => document.querySelector(selector));
    return result.length === selectors.length;
  }

  function checkFunction(functions) {
    let result = functions.filter(func => func());
    return result.length === functions.length;
  }

  let isAllowedHost = checkHosts(host, rules.allowedHosts);
  let isSelectorsFound = checkSelectors(rules.selectors);
  let isFunctionsPassed = checkFunction(rules.functions);

  if (!(isAllowedHost && isSelectorsFound && isFunctionsPassed)) {
    rules.block();
  }
}
