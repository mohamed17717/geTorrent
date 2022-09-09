/* eslint-disable no-eval */
/* eslint-disable no-useless-escape */

// function here are not related
// every one has its independent rule

export default {
  removeUnwnatedTagsFromSrc(src, unwantedTags) {
    for (let tag of unwantedTags) {
      let regexOpenTag = `<${tag.name}[^>]*>`;
      let regexCloseTag = `<\/${tag.name}[^>]*>`;
      let regexes = [regexOpenTag, regexCloseTag];
      if (!tag.hasCloseTag) {
        regexes.pop();
      }

      for (let regex of regexes) {
        regex = new RegExp(regex, "g");
        src = src.replace(regex, "");
      }
    }
    return src;
  },

  toNormalArray(list) {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      arr.push(list[i]);
    }
    return arr;
  },

  splitListOfElmsAccordingToTagName(list) {
    // return object of elmsNames every has an arr containe elms
    // {SPAN: [span1, span2....], ...}

    let elms = {};
    for (let i = 0; i < list.length; i++) {
      let elm = list[i];
      let tagName = elm.tagName;
      if (!Object.hasOwn(elms, tagName)) {
        elms[tagName] = [];
      }

      elms[tagName].push(elm);
    }
    return elms;
  },

  randomChars() {
    return Math.random()
      .toString(36)
      .substring(2, 15);
  },

  randomId() {
    let prefix = "ID-"; // to make sure that is valid id
    return prefix + this.randomChars().repeat(2);
  },

  createOutputElement() {
    let elm = this.createElement("div");
    elm.style.display = "none";

    return elm;
  },

  createElement(tagName) {
    let elm = document.createElement(tagName);
    elm.id = this.randomId();
    document.body.appendChild(elm);

    return elm;
  },

  combineObjects() {
    let result = {};
    for (let obj of arguments) {
      for (let key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  },

  convertSizeToKB(size) {
    let converterMap = {
      gb: "*1024*1024",
      mb: "*1024",
      kb: ""
    };
    size = size.toLowerCase();
    let unit = size.trim().slice(-2);
    let eqn = `${parseFloat(size)} ${converterMap[unit]}`;
    return eval(eqn);
  },

  getElementsmsWithText(parent, selector, text) {
    let elms = this.toNormalArray(parent.querySelectorAll(selector));
    let ptrn = new RegExp(text, "gi");
    return elms.filter(elm =>
      elm.innerText.replace(/[^\w\s]/g, "").match(ptrn)
    );
  },

  openUrlInNewTab(url) {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.style.opacity = 0;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  notification(text, status) {
    let div = document.createElement("div");
    div.id = "notification";
    div.classList.add(status ? "success" : "error");
    div.style.opacity = 0;
    div.innerText = text;

    document.body.appendChild(div);

    div.style.right = `-${div.clientWidth - 1}px`;

    function out() {
      div.style.opacity = 0;
      div.style.right = `-${div.clientWidth - 1}px`;
      setTimeout(() => div.remove(), 1000);
    }

    setTimeout(() => {
      div.style.opacity = "";
      div.style.right = "";
      setTimeout(out, 2000);
    }, 500);
  },

  calcWidth(selector) {
    let elms = document.querySelectorAll(selector);
    elms.forEach(elm => {
      let l = elms.length;
      elm.style.width = `calc(100% / ${l} - ${l}px)`;
    });
  }
};
