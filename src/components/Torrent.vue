<template>
  <div id="torrent">
    <h1>Torrent</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Torrent",
  data() {
    return {
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

        getSearchResults(parentElement) {
          let results = this.vm.helper.toNormalArray(
            parentElement.querySelectorAll(this.search.resultsSelector)
          );
          let obj = this;
          results = results.map(this.search.mapOnResults);
          results = results.filter(result =>
            this.search.filterResultsByOne(result, this.vm.filters.one)
          );
          results = results.map(result => {
            result.url = obj.absoluteUrl(result.url);
            return result;
          });
          return this.search.filterResultsByAll(results, this.vm.filters.many);
        },

        absoluteUrl(relative) {
          if (relative[0] === "/") {
            return (this.url + relative)
              .replace(/\/\//g, "/")
              .replace(/:\//, "://");
          }
          return relative;
        },

        getDataFromEachMoviePage(movieURL) {
          let url = this.absoluteUrl(movieURL);

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
              let data = this.moviePage.extractData(elm, this);
              return data;
            });
        }
      }
    };
  },
  computed: {
    name() {
      return this.getFilmInfo.name;
    },

    year() {
      return this.getFilmInfo.year;
    },

    ...mapGetters(["getFilmInfo"])
  }
};
</script>
