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
              {{ torrent.cover ? setFilmCover(torrent) : null }}
              <!-- {{ quality.pictures && quality.pictures.length ? setFilmPictures(quality): null }} -->
            </i>
            <i v-else-if="quality.magnets" class="fa fa-magnet">
              {{
                !getFilmCover
                  ? setFilmCover({ cover: quality.cover || torrent.cover })
                  : ""
              }}
              <!--  || 'https://www.directv.com/img/movies.jpg' -->
              {{
                getFilmPictures.length === 0 && quality.pictures.length > 0
                  ? setFilmPictures(quality)
                  : ""
              }}
            </i>
          </div>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

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
          url: "https://yts.mx/",
          search: {
            movie: {
              name: null,
              year: null
            },
            path: "browse-movies/{{movieName}}/all/all/0/latest/0/all",
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

            isMagnet(url) {
              return url.startsWith("magnet");
            },

            downloadBtns(dataparent) {
              let torrentsSelector = 'a[href*="/torrent/download"]';
              let magnetsSelector = 'a[href^="magnet"]';
              let torrentElms = dataparent.querySelectorAll(torrentsSelector);
              let elms = torrentElms.length
                ? torrentElms
                : dataparent.querySelectorAll(magnetsSelector);
              let elmsArr = vm.helper.toNormalArray(elms);
              let filter = elm =>
                elm.classList.length === 0 && !elm.querySelector("span");

              let first = elmsArr[0];
              if (first && this.isMagnet(first.getAttribute("href"))) {
                filter = elm =>
                  elm.getAttribute("title") &&
                  elm.querySelector("span.icon-in");
              }
              return elmsArr.filter(filter);
            },

            torrents(dataparent) {
              let downloadBtns = this.downloadBtns(dataparent);
              let first = downloadBtns[0];
              if (first && this.isMagnet(first.getAttribute("href"))) return [];
              return downloadBtns.map(elm => elm.getAttribute("href"));
            },

            magnets(dataparent) {
              let downloadBtns = this.downloadBtns(dataparent);
              let first = downloadBtns[0];
              if (first && this.isMagnet(first.getAttribute("href")))
                return downloadBtns.map(elm => elm.getAttribute("href"));
              return [];
            },

            qualities(dataparent) {
              let downloadBtns = this.downloadBtns(dataparent);
              return downloadBtns.map(elm => elm.innerText);
            },

            sizes(dataparent) {
              let elms = dataparent.querySelectorAll('span[title="File Size"]');
              let elmsArr = vm.helper.toNormalArray(elms);
              return elmsArr
                .map(elm => elm.parentElement.innerText)
                .filter(size => /\d+/.test(size));
            },

            extractor(dataparent) {
              let torrents = this.torrents(dataparent);
              let magnets = this.magnets(dataparent);
              let qualities = this.qualities(dataparent);
              let sizes = this.sizes(dataparent);

              let data = [];

              for (let i = 0; i < qualities.length; i++) {
                data.push({
                  size: sizes[i],
                  quality: qualities[i],
                  torrentURL: torrents[i],
                  magnets: [magnets[i]],
                  pictures: []
                });
              }

              return data;
            },

            extractData(dataparent) {
              if (!dataparent.querySelector("#movie-poster")) {
                throw new Error("this is not available without login");
              }
              return this.extractor(dataparent);
            }
          },

          getMirrorUrl(url) {
            let ytsPath = url.split("/").pop();
            ytsPath = ytsPath.split("-");
            let ytsYear = ytsPath.pop();
            let ytsName = ytsPath.join("-");

            let mirrorHost = "https://www9.yify.is/";
            let mirrorUrl = `${mirrorHost}movie/view/${ytsName}/${ytsYear}`;

            return mirrorUrl;
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

              results = repeatationFilter(results, "quality", prefer);
              return results.length ? results : [undefined]; // [undefined to cause error]
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

    scrapingMapCount() {
      return this.sites.length;
    },

    site() {
      return this.sites[this.scrapingMapIndex];
    },

    ...mapGetters([
      "getFilmInfo",
      "getScrapingMapParent",
      "getFilmCover",
      "getFilmPictures"
    ])
  },

  methods: {
    scrapingMapIndexPlusOne() {
      if (this.scrapingMapIndex === null) {
        this.scrapingMapIndex = 0;
      } else if (this.scrapingMapIndex < this.scrapingMapCount - 1) {
        this.scrapingMapIndex++;
      }
    },

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
          vm.setToProgressBar(10);
          return siteObj.getSearchResults(elm);
        })
        .then(searchResults => {
          vm.setToProgressBar(10);

          function getSearchResult(result) {
            console.log("man man : ", result);
            if (!result.url) return;
            siteObj
              .getDataFromEachMoviePage(result.url)
              .then(movieData => {
                vm.setToProgressBar(80 / searchResults.length);
                vm.torrents.push(
                  vm.helper.combineObjects({ qualities: movieData }, result)
                );
              })
              .catch(err => {
                console.error(err);

                if (result.url.startsWith("https://yts.mx")) {
                  let mirrorUrl = siteObj.getMirrorUrl(result.url);
                  result.url = mirrorUrl;
                  getSearchResult(result);
                }
              });
          }
          for (let searchResult of searchResults) {
            getSearchResult(searchResult);
          }
        })
        .catch(err => {
          vm.setToProgressBar((80 - 20) / this.scrapingMapCount);
          console.error(err);
          this.scrapingMapIndexPlusOne();
        });
    },

    copyText(text) {
      let status;
      let elm = this.helper.createElement("input");
      elm.setAttribute("type", "text");
      elm.setAttribute("value", text);
      elm.select();

      try {
        status = document.execCommand("copy");
      } catch (err) {
        alert("Oops, unable to copy");
      }

      /* unselect the range */
      elm.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
      return status;
    },

    openUrlInNewTab({ torrentURL, magnets }) {
      if (torrentURL) {
        this.helper.openUrlInNewTab(torrentURL);
      } else if (magnets.length) {
        let magnet = magnets[0];
        let status = this.copyText(magnet);
        let msg = status ? "تم النسخ بنجاح" : "فشل النسخ";

        this.helper.notification(msg, status);
      } else {
        alert(" i dont know ");
      }
    },

    ...mapMutations(["setFilmCover", "setFilmPictures", "setToProgressBar"])
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
        this.setFilmCover({ cover: "" });
        this.setFilmPictures({ pictures: [] });
      } else {
        this.scrapingMapIndex = null;
      }
    }
  },

  updated() {
    this.helper.calcWidth(".torrent button");
  }
};
</script>
