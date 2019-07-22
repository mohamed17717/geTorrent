/* eslint-disable no-unused-vars */

let proxies = [
  {
    url: "https://api.allorigins.win/get?url={{url}}",
    returnJSON: true,
    jsonName: "contents"
  },

  {
    url: "http://www.whateverorigin.org/get?url={{url}}&callback=?",
    returnJSON: true,
    jsonName: "contents"
  },

  {
    url: "https://api.codetabs.com/v1/proxy?quest={{url}}",
    returnJSON: false,
    jsonName: null
  }
];

export default {
  get(url, proxy = proxies[0]) {
    // return promise contain page src
    let fullURL = proxy.url.replace("{{url}}", encodeURIComponent(url));

    return fetch(fullURL)
      .then(data => (proxy.returnJSON ? data.json() : data.text()))
      .then(data => (proxy.returnJSON ? data[proxy.jsonName] : data));
  }

  // fetch('https://yts.lt/')
  //   .then(data => data.text())
  //   .then(src => { console.log(src); document.body.innerHTML = src; return src;} )
  //   .catch(err => console.log(err))
};
