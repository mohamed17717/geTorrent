export default {
  setFilmInfo({ film }, { name, year }) {
    film.name = name;
    film.year = year;
  },

  setFilmCover({ film }, { cover }) {
    film.cover = cover;
  },

  setFilmPictures({ film }, { pictures }) {
    film.pictures = pictures;
  }
};
