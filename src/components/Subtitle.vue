<template>
  <div class="subtitle" v-if="subtitles.length">
    <h3>تحميل الترجمة</h3>

    <div class="btns">
      <button
        v-for="(subtitle, index) in subtitles"
        :key="index"
        @click="helper.openUrlInNewTab(subtitle.directUrl || subtitle.url)"
      >
        <div class="text">
          <p>
            {{ subtitle.language === "Arabic" ? "عربي" : "انجليزي" }}
            ({{ subtitle.feedback }})
          </p>
        </div>
        <div class="icon">
          <i class="fa fa-language"></i>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Subtitle",
  data() {
    return {
      subtitles: [],
      scrapingMapParent: {
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
            let parentElm = elm.querySelector(this.subtitle.selector) || elm;
            return this.subtitle.extractData(parentElm);
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
          url: "https://yifysubtitles.org/",
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
          ...this.getScrapingMapParent,
          vm: vm // vue model
        }
      };
    },

    ...mapGetters(["getFilmInfo", "getScrapingMapParent"])
  },

  methods: {
    scrapeSubtitle(siteObj) {
      let vm = this;
      let name = this.name;
      let year = this.year;

      siteObj.setMovieName(name);
      siteObj.setMovieYear(year);

      let searchUrl = siteObj.getSearchUrl();

      siteObj
        .scrape(searchUrl)
        .then(elm => {
          vm.setToProgressBar(10);
          return siteObj.getSearchResults(elm);
        })
        .then(searchResults => {
          vm.setToProgressBar(5);

          let result = searchResults[0];
          return siteObj.getSubtitles(result.url);
        })
        .then(subtitles => {
          for (let subtitle of subtitles) {
            siteObj.getDataFromEachMoviePage(subtitle.url).then(s => {
              vm.setToProgressBar(85 / subtitles.length);
              subtitle.directUrl = s.url;
              vm.subtitles.push(subtitle);
            });
          }
        })
        .catch(err => {
          vm.setToProgressBar(85);

          console.error(err);
        });
    },

    ...mapMutations(["setToProgressBar"])
  },
  watch: {
    name: function() {
      this.subtitles = [];
    },

    year: function() {
      this.subtitles = [];
    },

    subtitles: function() {
      if (this.subtitles.length === 0) {
        this.scrapeSubtitle(this.scrapingMap.yifysubtitles);
      }
    }
  },

  updated() {
    this.helper.calcWidth(".subtitle button");
  }
};
</script>
