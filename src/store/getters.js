export default {
  getFilmInfo({ film }) {
    return film;
  },

  getFilmName({ film }) {
    return film.name;
  },

  getFilmYear({ film }) {
    return film.year;
  },

  getScrapingMapParent({ scrapingMapParent }) {
    return scrapingMapParent;
  },

  getFilmCover({ film }) {
    return film.cover;
  },

  getFilmPictures({ film }) {
    return film.pictures;
  }
};
