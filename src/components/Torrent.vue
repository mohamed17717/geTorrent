<template>
  <div class="torrent" v-if="torrents.length">
    <h3>تحميل الفيلم</h3>
    <div class="btns">
      <template v-for="torrent in torrents">
        <button
          v-for="(quality, i) in torrent.qualities"
          :key="Math.round(Math.random() * 1000000) + i"
          @click="openUrlInNewTab(quality)"
        >
          <div class="text">
            <p>{{ quality.quality || torrent.quality }}</p>
            <p>{{ quality.size }}</p>
          </div>
          <div class="icon">
            <i v-if="quality.torrentURL" class="fa fa-download">
              {{ setFilmCover(torrent) }}
              {{ setFilmPictures({ pictures: [] }) }}
            </i>
            <i v-else-if="quality.magnets" class="fa fa-magnet">
              {{ setFilmCover(quality) }} {{ setFilmPictures(quality) }}
            </i>
          </div>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Torrent",
  data() {
    return {
      torrents: [],
      scrapingMapIndex: null,
      scrapingMapParent: {
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

        getDataFromEachMoviePage(movieURL) {
          let url = this.absoluteUrl(movieURL);

          return this.scrape(url).then(elm => {
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
          ...this.getScrapingMapParent,
          vm: vm
        },

        x1337: {
          name: "1337x",
          url: "https://1337x.to/",
          search: {
            movie: {
              name: null,
              year: null
            },
            path: "sort-category-search/{{movieName}}/Movies/seeders/desc/1/",
            method: "GET",
            resultsSelector: "table.table-list tr",

            mapOnResults(result) {
              let icon = result.querySelector("a.icon[href]");
              let seeds = result.querySelector("td.seeds");
              let leeches = result.querySelector("td.leeches");
              let nameCell = result.querySelector('.name a[href^="/torrent"]');
              let size = result.querySelector(".size");

              if (!icon) {
                return {};
              }

              size = size.innerHTML.match(/^[^<]+/) || [];
              size = size[0];

              let name = nameCell.innerText;
              let nameParts = name.split(vm.constants.regex.year);
              if (nameParts.length !== 3) {
                nameParts = ["", "", ""];
              }

              let quality =
                nameParts[2].match(vm.constants.regex.quality) || [];

              return {
                fullName: name,
                name: nameParts[0].replace(/[^\w ]/g, "").trim(),
                year: nameParts[1],
                url: nameCell.getAttribute("href"),
                seeds: parseInt(seeds.innerText),
                leeches: parseInt(leeches.innerText),
                size: size,
                quality: quality[0],
                icon: icon.getAttribute("href")
              };
            },
            filterResultsByOne(result, { nameFilter, yearFilter, seedFilter }) {
              let movie = this.movie;
              return (
                nameFilter(result, movie) &&
                yearFilter(result, movie) &&
                seedFilter(result)
              );
            },
            filterResultsByAll(results, { repeatationFilter }) {
              let prefer = (a, b) => {
                let aKB = vm.helper.convertSizeToKB(a.size);
                let bKB = vm.helper.convertSizeToKB(b.size);
                let minSize = vm.helper.convertSizeToKB("400 MB");

                if (aKB >= minSize && bKB >= minSize) {
                  return aKB < bKB ? a : b;
                }
                return aKB >= minSize ? a : b;
              };

              return repeatationFilter(results, "quality", prefer);
            }
          },
          moviePage: {
            dataParentSelector: ".torrent-category-detail",

            cover(dataparent) {
              let cover =
                dataparent.querySelector('img[src$="jpg"]') ||
                dataparent.querySelector('img[data-original$="jpg"]');
              if (!cover) {
                return undefined;
              }
              cover = cover.getAttribute("data-original") || cover.src;
              return cover;
            },

            size(dataparent) {
              let size = vm.helper.getElementsmsWithText(
                dataparent,
                "li",
                "size"
              );
              if (!size.length) {
                return;
              }
              return size[0].lastElementChild.innerText;
            },

            magnets(dataparent) {
              let magnets = dataparent.querySelectorAll('a[href^="magnet"]');
              return vm.helper.toNormalArray(magnets).map(m => m.href);
            },

            pictures(dataparent) {
              let pics = dataparent.querySelectorAll(
                'p img[data-original$="jpg"]'
              );
              pics = vm.helper.toNormalArray(pics);
              return pics.map(elm => elm.getAttribute("data-original"));
            },

            extractData: function(dataparent) {
              return [
                {
                  magnets: this.magnets(dataparent),
                  size: this.size(dataparent),
                  cover: this.cover(dataparent),
                  pictures: this.pictures(dataparent)
                }
              ];
            }
          },

          // inheritance
          ...this.scrapingMapParent,
          ...this.getScrapingMapParent,
          vm: vm
        }
      };
    },

    sites() {
      let list = [];
      for (let i in this.scrapingMap) {
        list.push(i);
      }

      return list;
    },

    site() {
      return this.sites[this.scrapingMapIndex];
    },

    ...mapGetters(["getFilmInfo", "getScrapingMapParent"])
  },

  methods: {
    scrapeMovie(siteObj) {
      let vm = this;
      let name = this.name;
      let year = this.year;

      siteObj.setMovieName(name);
      siteObj.setMovieYear(year);

      let searchUrl = siteObj.getSearchUrl();

      return siteObj
        .scrape(searchUrl)
        .then(elm => {
          // vm.setToProgressBar(10)
          return siteObj.getSearchResults(elm);
        })
        .then(searchResults => {
          // vm.setToProgressBar(10)
          console.log("search results: ", searchResults);
          for (let result of searchResults) {
            siteObj.getDataFromEachMoviePage(result.url).then(movieData => {
              // vm.setToProgressBar(80 / searchResults.length)
              let x = vm.helper.combineObjects(
                { qualities: movieData },
                result
              );
              vm.torrents.push(x);
            });
          }
        })
        .catch(err => {
          // vm.setToProgressBar((80 - 20) / this.scrapingMapCount)

          console.error(err);
          this.scrapingMapIndexPlusOne();
        });
    }
  },

  watch: {
    name() {
      this.torrents = [];
    },

    year() {
      this.torrents = [];
    },

    scrapingMapIndex() {
      let siteObj = this.scrapingMap[this.site];
      if (siteObj) {
        this.scrapeMovie(siteObj);
      }
    },

    torrents() {
      if (this.torrents.length === 0) {
        this.scrapingMapIndex = 0;
        // this.setFilmCover({ cover: '' })
      } else {
        this.scrapingMapIndex = null;
      }
    }
  }
};
</script>
