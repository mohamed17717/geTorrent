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

    scrapingMap() {
      let vm = this;
      return {
        yts: {
          name: "yts",
          url: "https://yts.am/",
          search: {
            movie: {
              name: null,
              year: null
            },
            path: "browse-movies/{{movieName}}/all/all/0/latest",
            method: "GET",
            resultsSelector: ".container section .row > div",
            mapOnResults(result) {
              let textInfo = result
                .querySelector("div")
                .textContent.trim()
                .split("\n");

              return {
                name: textInfo[0],
                year: textInfo[1],
                url: result.querySelector("a").href,
                cover: result.querySelector("img").src
              };
            },
            filterResultsByOne(result, { nameFilter, yearFilter }) {
              let movie = this.movie;
              return nameFilter(result, movie) && yearFilter(result, movie);
            },
            filterResultsByAll: results => [results[0]]
          },
          moviePage: {
            dataParentSelector: "#movie-tech-specs",
            extractData(dataparent) {
              let torrentsURLs = vm.helper.toNormalArray(
                dataparent.querySelectorAll('a[href*="/torrent/download"]')
              );
              torrentsURLs = torrentsURLs
                .filter(elm => elm.classList.length)
                .map(elm => elm.href);

              let elm = dataparent;
              dataparent = elm.querySelector(this.dataParentSelector) || elm;

              let data = [];
              let children = vm.helper.splitListOfElmsAccordingToTagName(
                dataparent.children
              );
              // every span have div contain his data
              let spans = children.SPAN;
              let divs = children.DIV;

              for (let i = 0; i < spans.length; i++) {
                let span = spans[i];
                let div = divs[i];
                let torrentURL = torrentsURLs[i];
                let tempData = {};

                let quality = span.textContent.trim();
                let sizeContiner = div.querySelector('div [title="File Size"]');
                let size = sizeContiner.parentElement.textContent.trim();

                tempData.quality = quality;
                tempData.size = size;
                tempData.torrentURL = torrentURL;

                data.push(tempData);
              }

              return data;
            }
          },

          // inheritance
          ...this.scrapingMapParent,
          vm: vm
        }
      };
    },

    ...mapGetters(["getFilmInfo"])
  }
};
</script>
