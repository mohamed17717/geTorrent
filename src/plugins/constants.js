/* eslint-disable no-unused-vars */

let unwantedTags = [
  {
    name: "link",
    hasCloseTag: false
  },
  {
    name: "script",
    hasCloseTag: true
  },
  {
    name: "style",
    hasCloseTag: true
  },
  {
    name: "iframe",
    hasCloseTag: true
  },
  {
    name: "meta",
    hasCloseTag: false
  }
  // {
  //   name: 'img',
  //   hasCloseTag: false
  // }
];

let regex = {
  openTag: "",
  closeTag: "",
  quality: /(2160|1080|720|480|360|240)p/i,
  year: /(19[56789][0-9]|20[01][0-9])/
};

// is used to replace in some specific place
// in the url and such structured text
// where place really matters
// not really used yet
let stringPlaceID = {
  movieName: "{{movieName}}"
};

export default {
  unwantedTags: unwantedTags,
  regex: regex,
  stringPlaceID: stringPlaceID
};
