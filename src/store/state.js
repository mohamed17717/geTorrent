export default {
  film: {
    name: "",
    year: ""
  },

  scrapingMapParent: {
    setMovieName(name) {
      this.search.movie.name = name;
    },

    setMovieYear(year) {
      this.search.movie.year = year;
    },

    getSearchUrl: function() {
      let movieName = this.search.movie.name;
      let url = this.url + this.search.path;

      return url.replace("{{movieName}}", movieName);
    },

    absoluteUrl(relative) {
      if (relative[0] === "/") {
        return (this.url + relative)
          .replace(/\/\//g, "/")
          .replace(/:\//, "://");
      }
      return relative;
    },

    scrape(url) {
      url = this.absoluteUrl(url);
      return this.vm.request
        .get(url)
        .then(src => {
          return this.vm.helper.removeUnwnatedTagsFromSrc(
            src,
            this.vm.constants.unwantedTags
          );
        })
        .then(src => {
          let elm = this.vm.helper.createOutputElement();
          elm.innerHTML = src;
          return elm;
        });
    }
  }
};
