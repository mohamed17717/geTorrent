<template>
  <div id="subtitle">
    <h1>Subtitle</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Subtitle",
  date() {
    return {
      scrapingMapParent: {
        setMovieName(name) {
          this.search.movie.name = name;
        },

        setMovieYear(year) {
          this.search.movie.year = year;
        },

        getSearchUrl() {
          let movieName = this.search.movie.name;
          let url = this.url + this.search.path;

          return url.replace("{{movieName}}", movieName);
        },

        getSearchResults(parentElement) {
          let elms = parentElement.querySelectorAll(
            this.search.resultsSelector
          );
          let results = this.vm.helper.toNormalArray(elms);

          return results
            .map(this.search.mapOnResults)
            .filter(result =>
              this.search.filterResultsByOne(result, this.vm.filters.one)
            );
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
        },

        getSubtitles(siteUrl) {
          return this.scrape(siteUrl)
            .then(elm => {
              let subtitles = elm.querySelectorAll(this.subtitles.selector);

              return this.vm.helper
                .toNormalArray(subtitles)
                .map(this.subtitles.mapOnSubtitles)
                .filter(subtitle =>
                  this.subtitles.filterSubtitlesByOne(
                    subtitle,
                    this.vm.filters.one
                  )
                )
                .map(subtitle => {
                  subtitle.url = this.absoluteUrl(subtitle.url);
                  return subtitle;
                });
            })
            .then(results => {
              return this.subtitles.filterSubtitlesByAll(
                results,
                this.vm.filters.many
              );
            });
        },

        getDataFromEachMoviePage(movieURL) {
          let url = this.absoluteUrl(movieURL);

          return this.scrape(url).then(elm => {
            let parentOfData = elm.querySelector(this.subtitle.selector);
            parentOfData = parentOfData || elm;
            return this.subtitle.extractData(parentOfData);
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
