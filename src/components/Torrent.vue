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
              size = size.length
                ? size[0].lastElementChild.innerText
                : undefined;
              return size;
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
          vm: vm
        }
      };
    },

    ...mapGetters(["getFilmInfo"])
  }
};
</script>
