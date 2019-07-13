/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

let filters = {
  one: {
    nameFilter(result, { name }) {
      return true;
    },

    yearFilter(result, { year }) {
      return year ? parseInt(year) === parseInt(result.year) : true;
    },

    seedFilter({ seeds, leeches }) {
      let minSeeds = 20;
      let minRatio = 1.3;
      let ratio = seeds / (leeches || 1);
      return seeds >= minSeeds || ratio > minRatio;
    },

    ptrnFilter(ptrn, text) {
      // check if word part of text or not
      return ptrn.test(text);
    },

    languageFilter({ language }) {
      let languages = ["Arabic", "English"];
      return languages.includes(language);
    }
  },

  many: {
    repeatationFilter(items, uniqueKey, preferingFunction) {
      let uniques = {};

      items.map(item => {
        let key = item[uniqueKey];
        if (uniques.hasOwnProperty(key)) {
          let old = uniques[key];
          uniques[key] = preferingFunction(old, item);
        } else {
          uniques[key] = item;
        }
      });

      let values = [];
      for (let val in uniques) {
        values.push(uniques[val]);
      }
      return values;
    },

    sizeFilter(results) {
      let prefer = (a, b) =>
        convertSizeToKB(a.size) < convertSizeToKB(b.size) ? a : b;
      return this.repeatationFilter(results, "quality", prefer);
    }
  }
};

export default filters;
