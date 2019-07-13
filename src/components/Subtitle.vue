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

    scrapingMap() {
      let vm = this;
      return {
        yifysubtitles: {
          name: "yifysubtitles",
          url: "https://www.yifysubtitles.com/",
          // step 1 // search for a movie //
          search: {
            movie: {
              name: null,
              year: null
            },
            path: "search?q={{movieName}}",
            method: "GET",
            resultsSelector: "ul.media-list li",
            mapOnResults: function(result) {
              let name = result.querySelector("h3").innerText;
              let url = result.querySelector("a");
              let year = vm.helper.getElementsmsWithText(
                result,
                "span",
                "year"
              );

              if (year.length) {
                year = year[0].innerText.match(/\d+/);
                year = year && year[0];
              }
              return {
                name: name,
                year: year,
                url: url.getAttribute("href")
              };
            },

            filterResultsByOne: function(result, { yearFilter, nameFilter }) {
              // result is output from "mapOnResults()"
              let movie = this.movie;
              return nameFilter(result, movie) && yearFilter(result, movie);
            },

            filterResultsByAll: results => results
          },
          // step 2 // extract subtitles from movie page //
          subtitles: {
            selector: "tbody tr",
            mapOnSubtitles: function(subtitle) {
              let url = subtitle.querySelector('a[href^="/sub"]');
              let feedback = subtitle.querySelector("td.rating-cell");
              let language = subtitle.querySelector(".sub-lang");

              return {
                language: language.innerText,
                url: url.getAttribute("href"),
                feedback: parseInt(feedback.innerText)
              };
            },

            filterSubtitlesByOne: function(subtitle, { languageFilter }) {
              return languageFilter(subtitle);
            },

            filterSubtitlesByAll: function(subtitles, { repeatationFilter }) {
              const preferingFunction = (a, b) =>
                a["feedback"] >= b["feedback"] ? a : b;
              return repeatationFilter(
                subtitles,
                "language",
                preferingFunction
              );
            }
          },
          // step 3 // extract subtitle url from subtitle page //
          subtitle: {
            selector: "body",
            extractData: function(container) {
              let url = container.querySelector('a[href$="zip"]');
              return { url: url.href };
            }
          },

          // inherit from parent
          ...this.scrapingMapParent,
          vm: vm // vue model
        }
      };
    },

    ...mapGetters(["getFilmInfo"])
  }
};
</script>
